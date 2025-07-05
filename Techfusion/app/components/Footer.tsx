import Techfusion from "/public/techfusion.png";

const Footer = () => {
  return (
    <footer className="rounded-lg shadow dark:bg-gray-900">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-10">
        <div className="flex flex-col items-center sm:flex-row sm:justify-center">
          <a className="flex items-center py-4 space-x-3 rtl:space-x-reverse">
            <img src={Techfusion.src} className="h-6" alt="Techfusion Logo" />
          </a>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 text-center dark:text-gray-400">
          © 2025
          <a
            href="https://bytepeaktechnology.com/"
            className="hover:text-white hover:font-semibold"
          >
            BytePeak™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
