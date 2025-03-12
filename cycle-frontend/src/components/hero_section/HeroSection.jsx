import banner from "../../assets/banner2.jpg";

const HeroSection = () => {
  return (
    <div>
      <div>
        <img
          src={banner}
          alt=""
          className="w-full h-svh object-cover object-center"
        />
      </div>
      <div className="absolute top-[40%] w-full text-end right-5">
        <h1 className="text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#4f46e5]">
          Discover Your Next Adventure !
        </h1>
        <p className="text-[10px] lg:text-2xl mt-2 lg:mt-5 lg:mr-5 font-semibold text-[#374151]">  
          Shop Our Latest Arrival & Unleash Your style
        </p>
      </div>
    </div>
  )
}

export default HeroSection