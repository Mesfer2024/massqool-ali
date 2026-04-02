import HeroSection from '@/components/home/HeroSection';
import CraftsmanshipSection from '@/components/home/CraftsmanshipSection';
import GallerySection from '@/components/home/GallerySection';
import BrandValuesSection from '@/components/home/BrandValuesSection';
import CustomerReviewsSection from '@/components/home/CustomerReviewsSection';
import WhatsAppCTASection from '@/components/home/WhatsAppCTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CraftsmanshipSection />
      <GallerySection />
      <BrandValuesSection />
      <CustomerReviewsSection />
      <WhatsAppCTASection />
    </>
  );
}
