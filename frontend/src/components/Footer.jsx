function Footer() {
  return (
    <footer className="mt-auto bg-gray-100">
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="text-sm text-gray-600">&copy; 2025 JobPortal. All rights reserved.</p>
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li><a href="#" className="text-sm text-gray-600 hover:text-orange-500">About</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-orange-500">Contact</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-orange-500">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-orange-500">Terms of Service</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer

