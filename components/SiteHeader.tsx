"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const utilityLinks = [
  { label: "후원하기", href: "#support" },
  { label: "뉴스레터", href: "/newsletter" },
  { label: "YouTube", href: "#listen" },
  { label: "Podcast", href: "#listen" },
  { label: "Search", href: "#footer-search" },
  { label: "Admin", href: "/admin" }
];

const primaryLinks = [
  { label: "Interviews", href: "/interviews/waiting-face-film" },
  { label: "Film", href: "/#film" },
  { label: "Art", href: "/#art" },
  { label: "Music", href: "/#music" },
  { label: "Books", href: "/#books" },
  { label: "Essays", href: "/essays/how-to-watch-nonchristian-film" },
  { label: "Guides", href: "/guides" },
  { label: "Events", href: "/#briefing" }
];

export function SiteHeader() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const updateHeaderState = () => {
      setIsCompact(window.scrollY > 12);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

  return (
    <header className={isCompact ? "site-header site-header-compact" : "site-header"}>
      <div className="utility-bar">
        <nav aria-label="상단 유틸리티">
          {utilityLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="masthead">
        <Link className="brand-lockup" href="/" aria-label="DOULE SALON 홈">
          <span className="brand-mark">DOULE SALON</span>
          <span className="brand-tagline">신앙으로 문화를 읽는 매거진</span>
        </Link>
        <Link className="newsletter-link" href="/newsletter">
          주간 기독교 문화 편지
        </Link>
      </div>

      <nav className="primary-nav" aria-label="주요 카테고리">
        {primaryLinks.map((link) => (
          <Link key={link.label} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
