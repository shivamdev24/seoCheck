

// app/api/analyze/route.ts
import { NextRequest } from 'next/server'

interface Finding {
  id: string
  check: string
  status: 'pass' | 'fail' | 'warn'
  value: string
  recommendation: string
  priority?: 'high' | 'medium' | 'low'
  impact?: string
}

interface CategoryData {
  status: string
  findings: Finding[]
  score: number
  totalChecks: number
}

interface SEOResponse {
  success: boolean
  message: string
  data?: {
    overallScore: number
    categories: {
      onPageSEO: CategoryData
      technicalSEO: CategoryData
      performance: CategoryData
      accessibility: CategoryData
      contentQuality: CategoryData
      mobileFriendly: CategoryData
    }
    totalIssues: {
      critical: number
      warnings: number
      passed: number
    }
    analysisTime: number
    suggestions: string[]
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  const body = await req.json()
  const url = body?.url

  if (!url || !/^https?:\/\/.+/.test(url)) {
    return Response.json({ success: false, message: 'Invalid URL format' }, { status: 400 })
  }

  try {
    const base = new URL(url)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    const html = await response.text()
    const headers = response.headers

    const findings: Record<string, Finding[]> = {
      onPageSEO: [],
      technicalSEO: [],
      performance: [],
      accessibility: [],
      contentQuality: [],
      mobileFriendly: []
    }

    // --- ADVANCED ON-PAGE SEO ANALYSIS ---
    
    // Title Tag Analysis
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ''
    const titleLength = title.length

    findings.onPageSEO.push({
      id: 'titleLength',
      check: 'Title Tag Optimization',
      status: titleLength >= 30 && titleLength <= 60 ? 'pass' : titleLength === 0 ? 'fail' : 'warn',
      value: titleLength === 0 ? 'Missing title tag' : `${titleLength} characters: "${title.substring(0, 50)}${title.length > 50 ? '...' : ''}"`,
      recommendation: titleLength === 0 ? 'Add a title tag' : titleLength < 30 ? 'Title is too short, expand to 30-60 characters' : titleLength > 60 ? 'Title is too long, keep it under 60 characters' : 'Title length is optimal',
      priority: titleLength === 0 ? 'high' : titleLength < 30 || titleLength > 60 ? 'medium' : 'low',
      impact: 'Title tags are critical for search rankings and click-through rates'
    })

    // Meta Description Analysis
    const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]*content=["'](.*?)["']/i)
    const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : ''
    const metaDescLength = metaDesc.length

    findings.onPageSEO.push({
      id: 'metaDescOptimization',
      check: 'Meta Description Optimization',
      status: metaDescLength >= 120 && metaDescLength <= 160 ? 'pass' : metaDescLength === 0 ? 'fail' : 'warn',
      value: metaDescLength === 0 ? 'Missing meta description' : `${metaDescLength} characters: "${metaDesc.substring(0, 80)}${metaDesc.length > 80 ? '...' : ''}"`,
      recommendation: metaDescLength === 0 ? 'Add a meta description' : metaDescLength < 120 ? 'Meta description is too short' : metaDescLength > 160 ? 'Meta description is too long' : 'Meta description length is optimal',
      priority: metaDescLength === 0 ? 'high' : 'medium',
      impact: 'Meta descriptions influence click-through rates from search results'
    })

    // Heading Structure Analysis
    const h1Tags = html.match(/<h1[^>]*>(.*?)<\/h1>/gi) || []
    const h2Tags = html.match(/<h2[^>]*>/gi) || []
    const h3Tags = html.match(/<h3[^>]*>/gi) || []

    findings.onPageSEO.push({
      id: 'headingStructure',
      check: 'Heading Structure (H1-H3)',
      status: h1Tags.length === 1 && h2Tags.length > 0 ? 'pass' : h1Tags.length === 0 ? 'fail' : 'warn',
      value: `H1: ${h1Tags.length}, H2: ${h2Tags.length}, H3: ${h3Tags.length}`,
      recommendation: h1Tags.length === 0 ? 'Add exactly one H1 tag' : h1Tags.length > 1 ? 'Use only one H1 tag per page' : h2Tags.length === 0 ? 'Add H2 tags to structure content' : 'Good heading structure',
      priority: h1Tags.length === 0 ? 'high' : 'medium',
      impact: 'Proper heading structure improves SEO and accessibility'
    })

    // Image Alt Text Analysis
    const allImages = html.match(/<img[^>]*>/gi) || []
    const imagesWithAlt = html.match(/<img[^>]*alt=["'][^"']*["'][^>]*>/gi) || []
    const missingAltCount = allImages.length - imagesWithAlt.length

    findings.onPageSEO.push({
      id: 'imageAltText',
      check: 'Image Alt Text Optimization',
      status: missingAltCount === 0 ? 'pass' : missingAltCount < allImages.length / 2 ? 'warn' : 'fail',
      value: `${missingAltCount} of ${allImages.length} images missing alt text`,
      recommendation: missingAltCount === 0 ? 'All images have alt text' : 'Add descriptive alt text to all images for better accessibility and SEO',
      priority: missingAltCount > 0 ? 'medium' : 'low',
      impact: 'Alt text improves accessibility and helps search engines understand images'
    })

    // Internal Links Analysis
    const internalLinks = html.match(/<a[^>]*href=["'][^"']*["'][^>]*>/gi) || []
    const externalLinks = internalLinks.filter(link => 
      link.includes('http') && !link.includes(base.hostname)
    )

    findings.onPageSEO.push({
      id: 'internalLinking',
      check: 'Internal Link Structure',
      status: internalLinks.length > 5 ? 'pass' : internalLinks.length > 0 ? 'warn' : 'fail',
      value: `${internalLinks.length} total links (${externalLinks.length} external)`,
      recommendation: internalLinks.length < 3 ? 'Add more internal links to improve site navigation' : 'Good internal linking structure',
      priority: 'medium',
      impact: 'Internal links help distribute page authority and improve user navigation'
    })

    // --- ADVANCED TECHNICAL SEO ANALYSIS ---

    // Robots.txt Analysis
    const robotsResponse = await fetch(`${base.origin}/robots.txt`).catch(() => ({ ok: false }))
    let robotsContent = ''
    if (robotsResponse.ok && typeof (robotsResponse as Response).text === 'function') {
      robotsContent = await (robotsResponse as Response).text().catch(() => '')
    }

    findings.technicalSEO.push({
      id: 'robotsTxtAnalysis',
      check: 'Robots.txt Configuration',
      status: robotsResponse.ok ? 'pass' : 'warn',
      value: robotsResponse.ok ? 'Present and accessible' : 'Missing or inaccessible',
      recommendation: robotsResponse.ok ? 'Robots.txt found' : 'Add a robots.txt file to control search engine crawling',
      priority: 'medium',
      impact: 'Robots.txt helps control how search engines crawl your site'
    })

    // Sitemap Analysis
    const sitemapResponse = await fetch(`${base.origin}/sitemap.xml`).catch(() => ({ ok: false }))
    
    findings.technicalSEO.push({
      id: 'sitemapXmlAnalysis',
      check: 'XML Sitemap Presence',
      status: sitemapResponse.ok ? 'pass' : 'fail',
      value: sitemapResponse.ok ? 'XML sitemap found' : 'XML sitemap missing',
      recommendation: sitemapResponse.ok ? 'Sitemap is present' : 'Create and submit an XML sitemap to help search engines discover all your pages',
      priority: sitemapResponse.ok ? 'low' : 'high',
      impact: 'XML sitemaps help search engines discover and index all your pages'
    })

    // SSL/HTTPS Analysis
    const isHTTPS = url.startsWith('https://')
    findings.technicalSEO.push({
      id: 'sslAnalysis',
      check: 'SSL/HTTPS Implementation',
      status: isHTTPS ? 'pass' : 'fail',
      value: isHTTPS ? 'Site uses HTTPS' : 'Site uses HTTP (not secure)',
      recommendation: isHTTPS ? 'SSL certificate is properly configured' : 'Implement SSL certificate and redirect HTTP to HTTPS',
      priority: isHTTPS ? 'low' : 'high',
      impact: 'HTTPS is a ranking factor and essential for user trust and security'
    })

    // Canonical URL Analysis
    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["'](.*?)["']/i)
    const hasCanonical = !!canonicalMatch

    findings.technicalSEO.push({
      id: 'canonicalUrl',
      check: 'Canonical URL Implementation',
      status: hasCanonical ? 'pass' : 'warn',
      value: hasCanonical ? `Canonical URL: ${canonicalMatch![1]}` : 'No canonical URL specified',
      recommendation: hasCanonical ? 'Canonical URL is set' : 'Add canonical URLs to prevent duplicate content issues',
      priority: 'medium',
      impact: 'Canonical URLs help prevent duplicate content penalties'
    })

    // Open Graph Meta Tags
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]*content=["'](.*?)["']/i)
    const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]*content=["'](.*?)["']/i)
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["'](.*?)["']/i)

    const ogTagsCount = [ogTitleMatch, ogDescMatch, ogImageMatch].filter(Boolean).length

    findings.technicalSEO.push({
      id: 'openGraphTags',
      check: 'Open Graph Meta Tags',
      status: ogTagsCount >= 3 ? 'pass' : ogTagsCount >= 1 ? 'warn' : 'fail',
      value: `${ogTagsCount}/3 essential OG tags present`,
      recommendation: ogTagsCount >= 3 ? 'All essential Open Graph tags are present' : 'Add Open Graph tags (og:title, og:description, og:image) for better social media sharing',
      priority: 'medium',
      impact: 'Open Graph tags control how your content appears when shared on social media'
    })

    // --- PERFORMANCE ANALYSIS ---

    // Response Time Analysis
    const responseTime = response.headers.get('x-response-time') || 'Unknown'
    const contentLength = parseInt(response.headers.get('content-length') || '0')
    const pageSize = contentLength > 0 ? contentLength : html.length

    findings.performance.push({
      id: 'responseTime',
      check: 'Server Response Time',
      status: 'warn', // Since we can't measure real response time in this context
      value: `Page size: ${Math.round(pageSize / 1024)}KB`,
      recommendation: 'Optimize server response time to under 200ms for better user experience',
      priority: 'medium',
      impact: 'Fast response times improve user experience and search rankings'
    })

    // Compression Analysis
    const contentEncoding = headers.get('content-encoding')
    const hasCompression = !!contentEncoding

    findings.performance.push({
      id: 'compression',
      check: 'Content Compression',
      status: hasCompression ? 'pass' : 'fail',
      value: hasCompression ? `Using ${contentEncoding} compression` : 'No compression detected',
      recommendation: hasCompression ? 'Content compression is enabled' : 'Enable Gzip or Brotli compression to reduce file sizes',
      priority: hasCompression ? 'low' : 'high',
      impact: 'Content compression significantly reduces page load times'
    })

    // CSS and JS Analysis
    const cssLinks = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || []
    const jsScripts = html.match(/<script[^>]*src=["'][^"']*["'][^>]*>/gi) || []

    findings.performance.push({
      id: 'resourceOptimization',
      check: 'CSS/JS Resource Count',
      status: cssLinks.length + jsScripts.length <= 10 ? 'pass' : cssLinks.length + jsScripts.length <= 20 ? 'warn' : 'fail',
      value: `${cssLinks.length} CSS files, ${jsScripts.length} JS files`,
      recommendation: cssLinks.length + jsScripts.length > 10 ? 'Consider combining CSS/JS files to reduce HTTP requests' : 'Good resource optimization',
      priority: 'medium',
      impact: 'Fewer HTTP requests improve page load speed'
    })

    // --- ACCESSIBILITY ANALYSIS ---

    // Language Declaration
    const langMatch = html.match(/<html[^>]*lang=["']([^"']*)["']/i)
    const hasLang = !!langMatch

    findings.accessibility.push({
      id: 'languageDeclaration',
      check: 'Language Declaration',
      status: hasLang ? 'pass' : 'fail',
      value: hasLang ? `Language: ${langMatch![1]}` : 'No language declared',
      recommendation: hasLang ? 'Page language is declared' : 'Add lang attribute to html element',
      priority: hasLang ? 'low' : 'medium',
      impact: 'Language declaration helps screen readers and search engines'
    })

    // Form Labels
    const forms = html.match(/<form[^>]*>/gi) || []
    const labels = html.match(/<label[^>]*>/gi) || []
    const inputs = html.match(/<input[^>]*>/gi) || []

    if (forms.length > 0) {
      findings.accessibility.push({
        id: 'formAccessibility',
        check: 'Form Accessibility',
        status: labels.length >= inputs.length ? 'pass' : 'warn',
        value: `${forms.length} forms, ${labels.length} labels, ${inputs.length} inputs`,
        recommendation: labels.length < inputs.length ? 'Ensure all form inputs have associated labels' : 'Form accessibility looks good',
        priority: 'medium',
        impact: 'Proper form labels are essential for screen reader users'
      })
    }

    // ARIA Labels Analysis
    const ariaLabels = html.match(/aria-label=["'][^"']*["']/gi) || []
    const ariaDescribedBy = html.match(/aria-describedby=["'][^"']*["']/gi) || []
    
    findings.accessibility.push({
      id: 'ariaAttributes',
      check: 'ARIA Attributes Usage',
      status: ariaLabels.length > 0 || ariaDescribedBy.length > 0 ? 'pass' : 'warn',
      value: `${ariaLabels.length} aria-label, ${ariaDescribedBy.length} aria-describedby`,
      recommendation: ariaLabels.length === 0 && ariaDescribedBy.length === 0 ? 'Consider adding ARIA attributes for better accessibility' : 'Good use of ARIA attributes',
      priority: 'medium',
      impact: 'ARIA attributes improve accessibility for screen reader users'
    })

    // --- CONTENT QUALITY ANALYSIS ---

    // Word Count Analysis
    const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const wordCount = textContent.split(' ').length

    findings.contentQuality.push({
      id: 'contentLength',
      check: 'Content Length Analysis',
      status: wordCount >= 300 ? 'pass' : wordCount >= 150 ? 'warn' : 'fail',
      value: `Approximately ${wordCount} words`,
      recommendation: wordCount < 300 ? 'Consider adding more comprehensive content (aim for 300+ words)' : 'Good content length',
      priority: wordCount < 150 ? 'high' : 'medium',
      impact: 'Substantial content helps establish topic authority and improves rankings'
    })

    // Keyword Density (simplified analysis)
    const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 3)
    const contentWords = textContent.toLowerCase().split(' ')
    
    if (titleWords.length > 0) {
      const keywordDensity = titleWords.map(word => {
        const count = contentWords.filter(w => w.includes(word)).length
        return { word, count, density: (count / contentWords.length) * 100 }
      }).sort((a, b) => b.count - a.count)[0]

      findings.contentQuality.push({
        id: 'keywordDensity',
        check: 'Keyword Density Analysis',
        status: keywordDensity.density >= 1 && keywordDensity.density <= 3 ? 'pass' : keywordDensity.density > 3 ? 'warn' : 'fail',
        value: `Top keyword "${keywordDensity.word}": ${keywordDensity.density.toFixed(2)}% density`,
        recommendation: keywordDensity.density > 3 ? 'Keyword density too high, reduce repetition' : keywordDensity.density < 1 ? 'Consider using your target keywords more naturally in content' : 'Good keyword density',
        priority: 'medium',
        impact: 'Balanced keyword usage helps search engines understand your content topic'
      })
    }

    // Content Freshness (check for dates)
    const datePatterns = [
      /\d{4}-\d{2}-\d{2}/g,
      /\d{1,2}\/\d{1,2}\/\d{4}/g,
      /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi
    ]
    
    const foundDates = datePatterns.map(pattern => textContent.match(pattern) || []).flat()
    const hasRecentDates = foundDates.some(date => {
      const year = parseInt(date.match(/\d{4}/)?.[0] || '0')
      return year >= new Date().getFullYear() - 1
    })

    findings.contentQuality.push({
      id: 'contentFreshness',
      check: 'Content Freshness',
      status: hasRecentDates ? 'pass' : foundDates.length > 0 ? 'warn' : 'fail',
      value: foundDates.length > 0 ? `${foundDates.length} dates found, recent: ${hasRecentDates}` : 'No dates found in content',
      recommendation: hasRecentDates ? 'Content appears to be recent' : foundDates.length > 0 ? 'Consider updating content with recent information' : 'Add publication/update dates to content',
      priority: 'medium',
      impact: 'Fresh, up-to-date content performs better in search results'
    })

    // --- MOBILE FRIENDLY ANALYSIS ---

    // Viewport Meta Tag
    const viewportMatch = html.match(/<meta[^>]+name=["']viewport["'][^>]*content=["'](.*?)["']/i)
    const hasViewport = !!viewportMatch

    findings.mobileFriendly.push({
      id: 'viewportMeta',
      check: 'Viewport Meta Tag',
      status: hasViewport ? 'pass' : 'fail',
      value: hasViewport ? `Viewport: ${viewportMatch![1]}` : 'Missing viewport meta tag',
      recommendation: hasViewport ? 'Viewport meta tag is present' : 'Add viewport meta tag for mobile responsiveness',
      priority: hasViewport ? 'low' : 'high',
      impact: 'Viewport meta tag is essential for mobile-friendly websites'
    })

    // Media Queries in CSS
    const mediaQueries = html.match(/@media[^{]*\{[^}]*\}/gi) || []
    const inlineMediaQueries = html.match(/@media[^{]*{/gi) || []

    findings.mobileFriendly.push({
      id: 'responsiveDesign',
      check: 'Responsive Design (CSS Media Queries)',
      status: mediaQueries.length > 0 || inlineMediaQueries.length > 0 ? 'pass' : 'warn',
      value: `${mediaQueries.length + inlineMediaQueries.length} media queries found`,
      recommendation: mediaQueries.length === 0 && inlineMediaQueries.length === 0 ? 'Add CSS media queries for responsive design' : 'Responsive design implemented',
      priority: 'high',
      impact: 'Responsive design is crucial for mobile user experience and SEO'
    })

    // Touch-Friendly Elements
    const buttons = html.match(/<button[^>]*>/gi) || []
    const touchTargets = html.match(/(onclick|ontouchstart)=["'][^"']*["']/gi) || []

    findings.mobileFriendly.push({
      id: 'touchTargets',
      check: 'Touch-Friendly Interface',
      status: buttons.length > 0 ? 'pass' : 'warn',
      value: `${buttons.length} buttons, ${touchTargets.length} touch targets`,
      recommendation: buttons.length === 0 ? 'Ensure interactive elements are touch-friendly with adequate size' : 'Good touch-friendly interface',
      priority: 'medium',
      impact: 'Touch-friendly interfaces improve mobile user experience'
    })

    // --- CALCULATE SCORES AND GENERATE RESPONSE ---

    const categories = Object.keys(findings) as Array<keyof typeof findings>
    const categoryData: Record<string, CategoryData> = {}
    let totalCritical = 0
    let totalWarnings = 0
    let totalPassed = 0
    let overallScore = 0

    categories.forEach(category => {
      const categoryFindings = findings[category]
      const passed = categoryFindings.filter(f => f.status === 'pass').length
      const failed = categoryFindings.filter(f => f.status === 'fail').length
      const warned = categoryFindings.filter(f => f.status === 'warn').length
      
      totalPassed += passed
      totalWarnings += warned
      totalCritical += failed

      const score = Math.round((passed / categoryFindings.length) * 100)
      
      categoryData[category] = {
        status: failed > 0 ? 'fail' : warned > 0 ? 'warn' : 'pass',
        findings: categoryFindings,
        score,
        totalChecks: categoryFindings.length
      }
    })

    // Calculate overall score
    const totalChecks = totalPassed + totalWarnings + totalCritical
    overallScore = Math.round((totalPassed / totalChecks) * 100)

    // Generate suggestions
    const suggestions: string[] = []
    
    // Priority suggestions based on critical issues
    const criticalFindings = Object.values(findings).flat().filter(f => f.status === 'fail' && f.priority === 'high')
    if (criticalFindings.length > 0) {
      suggestions.push('Fix critical issues first: SSL certificate, XML sitemap, and viewport meta tag')
    }

    if (totalWarnings > 5) {
      suggestions.push('Address warning-level issues to improve overall SEO score')
    }

    if (overallScore < 70) {
      suggestions.push('Focus on on-page SEO fundamentals: title tags, meta descriptions, and heading structure')
    }

    suggestions.push('Regularly monitor and update your SEO implementation')
    suggestions.push('Consider professional SEO audit for comprehensive optimization')

    const analysisTime = Date.now() - startTime

    const responseData: SEOResponse = {
      success: true,
      message: 'SEO analysis completed successfully',
      data: {
        overallScore,
        categories: {
          onPageSEO: categoryData.onPageSEO,
          technicalSEO: categoryData.technicalSEO,
          performance: categoryData.performance,
          accessibility: categoryData.accessibility,
          contentQuality: categoryData.contentQuality,
          mobileFriendly: categoryData.mobileFriendly
        },
        totalIssues: {
          critical: totalCritical,
          warnings: totalWarnings,
          passed: totalPassed
        },
        analysisTime,
        suggestions
      }
    }

    return Response.json(responseData)

  } catch (error) {
    console.error('SEO Analysis Error:', error)
    return Response.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Analysis failed' 
      }, 
      { status: 500 }
    )
  }
}