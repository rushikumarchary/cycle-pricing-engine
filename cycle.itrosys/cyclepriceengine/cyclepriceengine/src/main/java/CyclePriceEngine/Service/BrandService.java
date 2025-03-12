package CyclePriceEngine.Service;
import CyclePriceEngine.Constants.Status;
import CyclePriceEngine.DTO.BrandDTO;
import CyclePriceEngine.Entity.Brand;
import CyclePriceEngine.Entity.Item;
import CyclePriceEngine.Exception.BrandDeletionException;
import CyclePriceEngine.Exception.BrandNotFoundException;

import CyclePriceEngine.Repository.BrandRepository;
import CyclePriceEngine.Repository.ItemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;



@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;
//AddBrand


    public BrandDTO addBrand(BrandDTO brandDTO) {
        brandRepository.findByBrandName(brandDTO.getBrandName())
                .ifPresent(b -> { throw new RuntimeException("Brand already exists: " + brandDTO.getBrandName()); });


        Brand brand = new Brand(
                brandDTO.getBrandId(),
                brandDTO.getBrandName(),
                brandDTO.getStatus(),
                brandDTO.getUpdatedBy(),
                LocalDateTime.now()
        );
       Brand  savedBrand= brandRepository.save(brand);

        return BrandDTO.builder().message("Brand Name added sucessfully") .brandName(savedBrand.getBrandName()).build();
    }

//

    //GetAllBrandNames
    public List<String> getAllBrandNames() {

        return brandRepository.findAllBrandNames();
    }

    //GetBrandByID
    public BrandDTO getBrandById(Long id) {
       Brand  brand = brandRepository.findById(id).orElseThrow(()->new BrandNotFoundException("Brand id is not found"+id));
        return BrandDTO.builder().message("brand id is found successfully")
                .brandId(brand.getBrandId()).brandName(brand.getBrandName()).build();

    }

    //GetBrandByName
   public BrandDTO getBrandByName(String brandName) {
        Brand brand = brandRepository.findByBrandName(brandName)
                .orElseThrow(() -> new BrandNotFoundException("Brand not found with name: " + brandName));

//        BrandDTO brandDTO = BrandMapper.toDTO(brand);
//       brandDTO.setStatus(Status.Y);
       // Ensure "Y" or "N" is returned
   return  BrandDTO.builder().brandId(brand.getBrandId()).brandName(brand.getBrandName())
           .status(brand.getStatus()).build();


    }

    //updatebrand
    public BrandDTO updateBrand(Long id, BrandDTO brandDTO) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new BrandNotFoundException("Brand not found with ID: " + id));

        brand.setBrandName(brandDTO.getBrandName());

        brand.setStatus(Status.Y); // Convert char to Enum
     brand=brandRepository.save(brand);
        return BrandDTO.builder().brandId(brand.getBrandId()).brandName(brand.getBrandName()).build();


    }

    //DeleteBrand
    public void deleteBrandById(Long brandId) {
        if (!brandRepository.existsById(brandId)) {
            throw new BrandNotFoundException("Brand with ID " + brandId + " not found.");
        }
        try {
            brandRepository.deleteById(brandId);
        } catch (DataIntegrityViolationException e) {
            throw new BrandDeletionException("Cannot delete: This brand is associated with items.");
        }
    }
}
