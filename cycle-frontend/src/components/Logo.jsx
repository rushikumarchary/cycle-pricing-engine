import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoSvg from '../assets/logo.svg';

// eslint-disable-next-line react/prop-types
const Logo = ({ className }) => {

  
  Logo.defaultProps = {
    className: ''
  };

  const { t } = useTranslation();

  // Text only logo for desktop
  const DesktopLogo = () => (
    <div className="hidden md:block">
      <div className="font-bold text-xl">
        <span className="text-white">{t('cycle')}</span>
        <span className="text-[#FFC107]">{t('PricingEngine')}</span>
      </div>
    </div>
  );

  // Icon only version for mobile and tablet
  const MobileLogo = () => (
    <div className="block md:hidden">
      <img src={logoSvg} alt="Cycle Pricing Engine" className="h-8 w-auto" />
    </div>
  );

  return (
    <Link to="/" className={`block ${className}`}>
      <DesktopLogo />
      <MobileLogo />
    </Link>
  );
};

export default Logo; 