"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isCoach = pathname.startsWith("/coach");
  const isParent = pathname === "/";

  return (
    <header className="mgfc-header">
      <div className="mgfc-header-inner">
        <div className="mgfc-left">
          <div className="mgfc-logo">
            <img
              src="https://lightslategrey-lobster-819582.hostingersite.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-04-at-11.51.29.jpeg"
              alt="Manchester Girls FC Logo"
            />
          </div>

          <div className="mgfc-title">
            <h1>Manchester Girls FC</h1>
            <p>the home of girls football</p>

            <div className="role-row">
              <div className="role-left">
                <Link href="/coach">
                  <div className={`role-pill ${isCoach ? "active" : ""}`}>
                    Coach
                  </div>
                </Link>

                <Link href="/">
                  <div className={`role-pill ${isParent ? "active" : ""}`}>
                    Parent
                  </div>
                </Link>
              </div>

              <div className="role-right">
                <div className="add-btn">Add</div>
                <div className="logout">Logout</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
