import Link from 'next/link';

const Header = () => {
  return (
    <header className="sticky top-0 border-b z-10 bg-white">
      <div className="py-5 px-20 mb-5 h-12">
        <Link href="/">
          My Blog
        </Link>
      </div>
    </header>
  );
};

export default Header;