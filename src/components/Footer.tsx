const Footer = () => {
  return (
    <footer className="animate-slide flex items-center justify-center text-sm sm:text-base pt-3 pb-5 h-[50px] bg-background text-center border-t">
      &copy; {new Date().getFullYear()} All rights reserved
    </footer>
  );
};

export default Footer;
