<?xml version="1.0" encoding="UTF-8"?>
<!-- Human-readable view of the sitemaps in a browser. Search engines ignore
     this stylesheet and read the XML as usual. -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <meta name="robots" content="noindex"/>
        <title>Sitemap – Marosko</title>
        <style>
          body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; margin: 24px; color: #1f2937; }
          h1 { font-size: 20px; margin: 0 0 4px; }
          p { margin: 0 0 16px; color: #6b7280; font-size: 14px; }
          table { border-collapse: collapse; width: 100%; font-size: 14px; }
          th, td { text-align: left; padding: 6px 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
          th { background: #f3f4f6; }
          a { color: #2563eb; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .alt { color: #6b7280; font-size: 12px; }
          .alt span { display: inline-block; margin-right: 8px; }
        </style>
      </head>
      <body>
        <h1>Sitemap</h1>
        <p>Počet URL: <xsl:value-of select="count(s:urlset/s:url)"/></p>
        <table>
          <tr><th>#</th><th>URL</th><th>Jazykové verzie</th><th>Posledná zmena</th></tr>
          <xsl:for-each select="s:urlset/s:url">
            <tr>
              <td><xsl:value-of select="position()"/></td>
              <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
              <td class="alt">
                <xsl:for-each select="xhtml:link">
                  <span><a href="{@href}"><xsl:value-of select="@hreflang"/></a></span>
                </xsl:for-each>
              </td>
              <td><xsl:value-of select="substring(s:lastmod, 1, 10)"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
