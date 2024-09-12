import cn from 'clsx'
import { ArrowRightIcon } from 'nextra/icons'
import type { Item } from 'nextra/normalize-pages'
import { ReactElement, useMemo } from 'react'
import Link from "next/link"
import { Fragment } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"

  
export function BreadcrumbDashboard({
  activePath
}: {
  activePath: Item[]
}): ReactElement {
  
    console.log("actie", activePath);
    return (
     <Breadcrumb className=" md:flex">
            <BreadcrumbList>
      {activePath.map((item, index) => {
        const isLink = !item.children || item.withIndexPage
        const isActive = index === activePath.length - 1

        return (
          <Fragment key={item.route + item.name}>
            {index > 0 && <BreadcrumbSeparator /> }
              <BreadcrumbItem>
                {isActive  ? 
                    (
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                    )
                    :
                    (
                        <BreadcrumbLink asChild>

                        <Link href={item.route}>{item.title}</Link>

                        </BreadcrumbLink>
                    )
                }
              </BreadcrumbItem>
          </Fragment>
        )
      })}
      
      </BreadcrumbList>
    </Breadcrumb>
  )
}