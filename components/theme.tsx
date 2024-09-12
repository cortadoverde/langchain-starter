import type { NextraThemeLayoutProps, PageOpts } from 'nextra'
import { useRouter } from 'next/router'
import { Navbar } from "@/components/Navbar";
import { useFSRoute, useMounted } from 'nextra/hooks'
import { Dashboard } from "@/components/component/dashboard";
import { TooltipProvider } from "@/components/ui/tooltip";
import "../app/globals.css";
import type { ReactElement, ReactNode } from 'react';
import { useMemo } from 'react';
import { normalizePages } from 'nextra/normalize-pages'
import { BreadcrumbDashboard } from "@/components/component/Breadcrumb"

const InnerLayout = ({
  filePath,
  pageMap,
  frontMatter,
  headings,
  timestamp,
  children
}: PageOpts & { children: ReactNode }): ReactElement => {
  const { locale = "es", defaultLocale } = useRouter()
  const fsPath = useFSRoute()
  console.log('pageMap:', pageMap[2].children);
  console.log('Type of pageMap:', typeof pageMap);
  console.log('Is pageMap an array?', Array.isArray(pageMap));


  const {
    activeType,
    activeIndex,
    activeThemeContext,
    activePath,
    topLevelNavbarItems,
    docsDirectories,
    flatDirectories,
    flatDocsDirectories,
    directories
  } = useMemo(
    () =>
      normalizePages({
        list: pageMap,
        locale,
        defaultLocale,
        route: fsPath
      }),
    [pageMap, locale, defaultLocale, fsPath]
  )

  const themeContext = { ...activeThemeContext, ...frontMatter }

  return (
    <main>

      <BreadcrumbDashboard  activePath={activePath} />

      {children}
    </main>
  )
}

export default function Layout({ children, ...context }: NextraThemeLayoutProps) {
  

  return (
      <TooltipProvider>
        <InnerLayout  {...context.pageOpts}>
          {children}
        </InnerLayout>
      </TooltipProvider>
  )
}