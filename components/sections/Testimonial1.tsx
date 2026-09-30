"use client";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic import for react-slick with SSR disabled
const Slider = dynamic(() => import("react-slick"), { ssr: false });

// Custom Prev and Next arrow components
const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
        <div className="prev-arrow" onClick={onClick}>
            <i className="fa-solid fa-angle-left" />
        </div>
    );
};

const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
        <div className="next-arrow" onClick={onClick}>
            <i className="fa-solid fa-angle-right" />
        </div>
    );
};

// Settings for image slider
const settings2 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    centerMode: false,
    focusOnSelect: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
            },
        },
        {
            breakpoint: 769,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};

// Settings for testimonial slider with custom arrows
const settings1 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    focusOnSelect: true,
    infinite: true,
    prevArrow: <PrevArrow />, // Custom prev arrow
    nextArrow: <NextArrow />, // Custom next arrow
};

// Data for slides
const imageSlides = ["/assets/img/all-images/testimonial/testimonial-img1.png", "/assets/img/all-images/testimonial/testimonial-img1-1.png", "/assets/img/all-images/testimonial/testimonial-img1-2.png", "/assets/img/all-images/testimonial/testimonial-img1-3.png"];

const testimonialSlides = [
    {
        quote: "I was comparing rentals in Noida and Delhi. Having the options and monthly costs together made it easier to narrow down what suited me.",
        authorImg: "/assets/img/all-images/testimonial/testimonial-img2.png",
        authorName: "Aarav Sharma",
    },
    {
        quote: "Finding a family home in Ghaziabad felt more manageable once I could compare nearby localities and rent ranges in one place.",
        authorImg: "/assets/img/all-images/testimonial/testimonial-img3.png",
        authorName: "Meera Verma",
    },
    {
        quote: "I was looking for my first flat in Greater Noida. The filters helped me focus on the configuration and budget I needed.",
        authorImg: "/assets/img/all-images/testimonial/testimonial-img4.png",
        authorName: "Rohan Gupta",
    },
    {
        quote: "The location search made it easier to explore rental homes around Delhi NCR before planning visits.",
        authorImg: "/assets/img/all-images/testimonial/testimonial-img5.png",
        authorName: "Ananya Singh",
    },
];

export default function Testimonial1() {
    return (
        <>
            <div
                className="testimonial1-section-area sp1"
                style={{
                    backgroundImage: "url(assets/img/all-images/bg/bg1.png)",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="testimonial-header space-margin60 heading1">
                                <h5 data-aos="fade-left" data-aos-duration={800}>
                                    sample renter feedback
                                </h5>
                                <div className="space20" />
                                <h2 className="text-anime-style-3">Sample stories from Delhi NCR renters</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="testimonialmain-slider">
                                <div className="row align-items-center">
                                    <div className="col-lg-5">
                                        <Slider {...settings2} className="images-area2 slider2">
                                            {imageSlides.map((img, index) => (
                                                <div key={index} className="img1 image-anime">
                                                    <img src={img} alt="housebox" />
                                                </div>
                                            ))}
                                        </Slider>
                                    </div>
                                    <div className="col-lg-7">
                                        <Slider {...settings1} className="testimonial-slider-area slider1">
                                            {testimonialSlides.map((slide, index) => (
                                                <div key={index} className="testimonial-box">
                                                    <img src="/assets/img/icons/quoto-icon1.svg" alt="housebox" />
                                                    <div className="space16" />
                                                    <p>{slide.quote}</p>
                                                    <div className="space32" />
                                                    <div className="test-images">
                                                        <div className="auhtor-area">
                                                            <div className="img1">
                                                                <img src={slide.authorImg} alt="housebox" />
                                                            </div>
                                                            <div className="text">
                                                                <Link href="#">{slide.authorName}</Link>
                                                                <div className="space10" />
                                                                <p>Happy Client</p>
                                                            </div>
                                                        </div>
                                                        <img src="/assets/img/elements/brand1.png" alt="housebox" className="brand1" />
                                                    </div>
                                                </div>
                                            ))}
                                        </Slider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
