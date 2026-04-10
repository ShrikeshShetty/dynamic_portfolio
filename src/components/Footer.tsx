export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} <span className="font-semibold text-white">Shrikesh Shetty</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
