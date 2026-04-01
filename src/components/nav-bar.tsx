import { Link } from "@/i18n/navigation";
import { NavLocaleSwitcher } from "@/components/nav-locale-switcher";

type Props = {
  appName: string;
};

export function NavBar({ appName }: Props) {
  return (
    <header className="nav-bar">
      <Link href="/" className="nav-brand">
        <span className="nav-logo" aria-hidden="true">S</span>
        <span>{appName}</span>
      </Link>
      <NavLocaleSwitcher />
    </header>
  );
}
