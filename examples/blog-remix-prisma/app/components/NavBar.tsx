import { Link, NavLink } from "@remix-run/react";

const sections = [
  { to: "blog", children: "Blog" },
  { to: "admin", children: "Admin" },
];

export function NavBar() {
  return (
    <header className="flex w-full justify-center bg-red-500 py-1 text-white">
      <nav className="container flex flex-auto items-center px-6">
        <h1 className="mr-auto select-none font-serif text-4xl">
          <Link to="/" className="outline-sky-300">
            Ipsum Remix
          </Link>
        </h1>
        {sections.map(({ to, children }) => (
          <NavLink
            key={to}
            to={to}
            className="ml-6 text-lg font-semibold outline-sky-300 [&.active]:underline"
          >
            {children}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
