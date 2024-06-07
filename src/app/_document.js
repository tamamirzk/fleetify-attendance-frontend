import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script src="/js/jquery-3.2.1.min.js" type="8493d93e50e84f2eb9ece403-text/javascript"></script>
          <script src="/js/popper.min.js" type="8493d93e50e84f2eb9ece403-text/javascript"></script>
          <script src="/js/bootstrap.min.js" type="8493d93e50e84f2eb9ece403-text/javascript"></script>
          <script src="/js/Chart.min.js" type="8493d93e50e84f2eb9ece403-text/javascript"></script>
          <script src="/js/chart.js" type="8493d93e50e84f2eb9ece403-text/javascript"></script>
          <script src="/plugins/theia-sticky-sidebar/ResizeSensor.js" type="8493d93e50e84f2eb9ece403-text/javascript"></script>
          <script src="/plugins/theia-sticky-sidebar/theia-sticky-sidebar.js" type="8493d93e50e84f2eb9ece403-text/javascript"></script>
          <script src="/js/script.js" type="8493d93e50e84f2eb9ece403-text/javascript"></script>
          <script src="https://dleohr.dreamstechnologies.com/cdn-cgi/scripts/7d0fa10a/cloudflare-static/rocket-loader.min.js" data-cf-settings="8493d93e50e84f2eb9ece403-|49" defer></script>
          
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
