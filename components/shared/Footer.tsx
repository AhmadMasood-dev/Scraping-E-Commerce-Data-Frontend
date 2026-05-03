export function Footer() {
  return (
    <footer className="w-full bg-muted border-t mt-12 py-16 px-6 md:px-16 text-muted-foreground">
      <div className="max-w-400 mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground">
            Scraping Demo
          </h3>
          <p className="text-sm">
            Empowering your e-commerce journey with real-time price comparisons
            and aggregation.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-primary transition-colors">
                Home
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="hover:text-primary transition-colors"
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="/categories"
                className="hover:text-primary transition-colors"
              >
                Categories
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>support@scrapingdemo.com</li>
            <li>+92 (300) 123-4567</li>
          </ul>
        </div>
      </div>
      <div className="max-w-400 mx-auto mt-12 pt-8 border-t text-center text-sm">
        &copy; {new Date().getFullYear()} Scraping Demo. All rights reserved.
      </div>
    </footer>
  );
}
