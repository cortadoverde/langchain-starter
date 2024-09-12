import { Header } from "@/components/component/header";

/* eslint sort-keys: error */
export default {
  comments: <h1></h1>,
  components: {
    h1: ({ children }) => (
      <h1
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          backgroundImage: 'linear-gradient(90deg,#7928CA,#FF0080)'
        }}
      >
        {children}
      </h1>
    )
  },
  cusdis: {
    appId: 'a2d11511-7012-4254-9483-cb49c8f4dfe8'
  },
  darkMode: true,
  dateFormatter: date => `Last updated at ${date.toDateString()}`,
  footer: (
    <small style={{ display: 'block', marginTop: '8rem' }}>
      <abbr
        title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
        style={{ cursor: 'help' }}
      >
        CC BY-NC 4.0
      </abbr>{' '}
      {new Date().getFullYear()} © Shu Ding.
      <a href="/feed.xml">RSS</a>
      <style jsx>{`
        a {
          float: right;
        }

        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </small>
  ),
  navbar : {
    component : <Header />
  }
}