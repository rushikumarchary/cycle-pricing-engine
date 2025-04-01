package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.entity.CustomUserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {

    @Value("${jwt.secret}")
    private String secretKey;



//public String generateToken(UserDetails userDetails) {
//    Map<String, Object> claims = new HashMap<>();
//
//    // Extract the role from userDetails and add it to the claims
//    if (!userDetails.getAuthorities().isEmpty()) {
//        claims.put("role", userDetails.getAuthorities().iterator().next().getAuthority());
//    }
//
//    return Jwts.builder()
//            .claims()
//            .add(claims)
//            .subject(userDetails.getUsername())
//            .issuedAt(new Date(System.currentTimeMillis()))
//            .expiration(new Date(System.currentTimeMillis() + 30 * 60 * 60 * 1000))
//            .and()
//            .signWith(getkey())
//            .compact();
//}

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        // Extract role from userDetails and add it to claims
        if (!userDetails.getAuthorities().isEmpty()) {
            claims.put("role", userDetails.getAuthorities().iterator().next().getAuthority());
        }

        // Cast userDetails to your custom UserDetails implementation to access email
        if (userDetails instanceof CustomUserDetails customUser) {
            claims.put("email", customUser.getEmail());
            claims.put("userId", customUser.getId());
        }

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 30 * 60 * 60 * 1000))
                .and()
                .signWith(getkey())
                .compact();
    }

    private SecretKey getkey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token,Claims::getSubject);
    }
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }
    private <T> T extractClaim(String token, Function<Claims,T> claimResolver){
       final Claims claims=extractAllClaims(token);
       return claimResolver.apply(claims);
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getkey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUsername(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}

//    public String generateToken(String username) {
//        Map<String,Object> claims = new HashMap<>();
//        return Jwts.builder()
//                .claims()
//                .add(claims)
//                .subject(username)
//                .issuedAt(new Date(System.currentTimeMillis()))
//                .expiration(new Date(System.currentTimeMillis() + 30 * 60 * 60 * 1000))
//                .and()
//                .signWith(getkey())
//                .compact();
//
//    }