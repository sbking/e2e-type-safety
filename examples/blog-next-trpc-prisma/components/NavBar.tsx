import Link from "next/link";
import ActiveLink from "./ActiveLink";

const sections = [
  { href: "/blog", children: "Blog" },
  { href: "/admin", children: "Admin" },
];

export function NavBar() {
  return (
    <header className="flex w-full justify-center bg-teal-500 py-1 text-white">
      <nav className="container flex flex-auto items-center px-6">
        <h1 className="mr-auto select-none font-serif text-4xl">
          <Link href="/">
            <a className="outline-sky-300">Ipsum tRPC</a>
          </Link>
        </h1>
        {sections.map(({ href, children }) => (
          <ActiveLink key={href} href={href} activeClassName="active">
            <a className="ml-6 text-lg font-semibold outline-sky-300 [&.active]:underline">
              {children}
            </a>
          </ActiveLink>
        ))}
      </nav>
    </header>
  );
}
