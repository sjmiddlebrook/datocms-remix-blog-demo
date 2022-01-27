import {
  Links,
  LiveReload,
  Meta,
  Form,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'remix';
import {
  renderMetaTags,
  toRemixMeta,
  useQuerySubscription,
} from 'react-datocms';
import styles from '~/styles/global.css';
import { metaTagsFragment } from '~/lib/fragments';
import { datoQuerySubscription } from '~/lib/datocms';

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export const loader = async ({ request }) => {
  return datoQuerySubscription({
    request,
    query: `
        {
          site: _site {
            favicon: faviconMetaTags(variants: [icon, msApplication, appleTouchIcon]) {
              ...metaTagsFragment
            }
          }
          blog {
            seo: _seoMetaTags {
              ...metaTagsFragment
            }
          }
        }
        ${metaTagsFragment}
      `,
  });
};

export const meta = ({
  data: {
    datoQuerySubscription: {
      initialData: { blog, site },
    },
  },
}) => {
  return toRemixMeta([...blog.seo, ...site.favicon]);
};

export default function App() {
  const { datoQuerySubscription } = useLoaderData();

  const {
    data: { site },
  } = useQuerySubscription(datoQuerySubscription);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {renderMetaTags([...site.favicon])}
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
