

// "use client"

// // pages/index.tsx
// import { useState } from 'react'

// interface Finding {
//   id: string
//   check: string
//   status: 'pass' | 'fail' | 'warn'
//   value: string
//   recommendation: string
//   priority?: 'high' | 'medium' | 'low'
//   impact?: string
// }

// interface CategoryData {
//   status: string
//   findings: Finding[]
//   score: number
//   totalChecks: number
// }

// interface ReportData {
//   overallScore: number
//   categories: {
//     onPageSEO: CategoryData
//     technicalSEO: CategoryData
//     performance: CategoryData
//     accessibility: CategoryData
//     contentQuality: CategoryData
//     mobileFriendly: CategoryData
//   }
//   totalIssues: {
//     critical: number
//     warnings: number
//     passed: number
//   }
//   analysisTime: number
//   suggestions: string[]
// }

// export default function Home() {
//   const [url, setUrl] = useState<string>('')
//   const [loading, setLoading] = useState<boolean>(false)
//   const [error, setError] = useState<string>('')
//   const [report, setReport] = useState<ReportData | null>(null)
//   const [activeTab, setActiveTab] = useState<string>('overview')

//   const handleAnalyze = async () => {
//     setError('')
//     setReport(null)

//     if (!url || !/^https?:\/\/.+/.test(url)) {
//       setError('Please enter a valid URL (must start with http:// or https://)')
//       return
//     }

//     setLoading(true)
//     try {
//       const res = await fetch('/api/analyze', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ url }),
//       })

//       const data = await res.json()

//       if (!data.success) throw new Error(data.message)
//       setReport(data.data)
//     } catch (err: any) {
//       setError(err.message || 'Unexpected error occurred.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     if (status === 'pass') return '✅'
//     if (status === 'fail') return '❌'
//     return '⚠️'
//   }

//   const getPriorityColor = (priority?: string) => {
//     if (priority === 'high') return 'text-red-600 bg-red-100'
//     if (priority === 'medium') return 'text-yellow-600 bg-yellow-100'
//     return 'text-blue-600 bg-blue-100'
//   }

//   const getScoreColor = (score: number) => {
//     if (score >= 90) return 'text-green-600'
//     if (score >= 70) return 'text-yellow-600'
//     return 'text-red-600'
//   }

//   const renderOverview = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
//           <h3 className="font-semibold text-green-800">Passed Checks</h3>
//           <p className="text-2xl font-bold text-green-600">{report?.totalIssues.passed}</p>
//         </div>
//         <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
//           <h3 className="font-semibold text-yellow-800">Warnings</h3>
//           <p className="text-2xl font-bold text-yellow-600">{report?.totalIssues.warnings}</p>
//         </div>
//         <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
//           <h3 className="font-semibold text-red-800">Critical Issues</h3>
//           <p className="text-2xl font-bold text-red-600">{report?.totalIssues.critical}</p>
//         </div>
//       </div>

//       <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
//         <h3 className="font-semibold text-blue-800 mb-3">🎯 Priority Recommendations</h3>
//         <ul className="space-y-2">
//           {report?.suggestions.map((suggestion, index) => (
//             <li key={index} className="text-blue-700 flex items-start gap-2">
//               <span className="text-blue-500 mt-1">•</span>
//               {suggestion}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {Object.entries(report?.categories || {}).map(([category, data]) => (
//           <div key={category} className="bg-white p-4 rounded-xl border shadow-sm">
//             <h4 className="font-semibold capitalize mb-2">
//               {category.replace(/([A-Z])/g, ' $1')}
//             </h4>
//             <div className="flex items-center justify-between">
//               <span className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
//                 {data.score}%
//               </span>
//               <span className="text-sm text-gray-500">
//                 {data.findings.filter(f => f.status === 'pass').length}/{data.totalChecks} passed
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )

//   const renderCategoryDetails = (categoryKey: string, categoryData: CategoryData) => (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-xl font-semibold capitalize">
//           {categoryKey.replace(/([A-Z])/g, ' $1')} Analysis
//         </h3>
//         <div className={`text-2xl font-bold ${getScoreColor(categoryData.score)}`}>
//           {categoryData.score}%
//         </div>
//       </div>
      
//       <div className="space-y-3">
//         {categoryData.findings.map((finding) => (
//           <div
//             key={finding.id}
//             className="p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
//           >
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="text-lg">{getStatusIcon(finding.status)}</span>
//                   <h4 className="font-semibold">{finding.check}</h4>
//                   {finding.priority && (
//                     <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(finding.priority)}`}>
//                       {finding.priority} priority
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-gray-600 mb-2">{finding.value}</p>
//                 {finding.impact && (
//                   <p className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-lg mb-2">
//                     💡 Impact: {finding.impact}
//                   </p>
//                 )}
//                 {finding.recommendation && (
//                   <p className="text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
//                     🔧 {finding.recommendation}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )

//   const tabs = [
//     { id: 'overview', label: '📊 Overview', icon: '📊' },
//     { id: 'onPageSEO', label: '📝 On-Page SEO', icon: '📝' },
//     { id: 'technicalSEO', label: '⚙️ Technical SEO', icon: '⚙️' },
//     { id: 'performance', label: '🚀 Performance', icon: '🚀' },
//     { id: 'accessibility', label: '♿ Accessibility', icon: '♿' },
//     { id: 'contentQuality', label: '📋 Content Quality', icon: '📋' },
//     { id: 'mobileFriendly', label: '📱 Mobile Friendly', icon: '📱' }
//   ]

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
//             <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
//               🔍 Advanced SEO Site Analyzer
//             </h1>
//             <p className="text-center text-blue-100 text-lg">
//               Comprehensive website analysis with actionable insights
//             </p>
//           </div>

//           {/* Input Section */}
//           <div className="p-6 bg-gray-50 border-b">
//             <div className="flex flex-col md:flex-row gap-4">
//               <input
//                 type="text"
//                 value={url}
//                 onChange={(e) => setUrl(e.target.value)}
//                 placeholder="Enter website URL (e.g., https://example.com)"
//                 className="flex-1 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <button
//                 onClick={handleAnalyze}
//                 disabled={loading}
//                 className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:opacity-90 transition disabled:opacity-60 font-semibold"
//               >
//                 {loading ? (
//                   <span className="flex items-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Analyzing...
//                   </span>
//                 ) : (
//                   '🔍 Analyze Website'
//                 )}
//               </button>
//             </div>

//             {error && (
//               <div className="mt-4 text-red-600 bg-red-100 p-4 rounded-xl border border-red-200">
//                 ❌ {error}
//               </div>
//             )}
//           </div>

//           {/* Results */}
//           {report && (
//             <div className="p-6">
//               {/* Score Header */}
//               <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border">
//                 <h2 className="text-2xl font-bold mb-2">SEO Analysis Results</h2>
//                 <div className={`text-5xl font-bold mb-2 ${getScoreColor(report.overallScore)}`}>
//                   {report.overallScore}/100
//                 </div>
//                 <p className="text-gray-600">
//                   Analysis completed in {report.analysisTime}ms
//                 </p>
//               </div>

//               {/* Tabs */}
//               <div className="mb-6">
//                 <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl">
//                   {tabs.map((tab) => (
//                     <button
//                       key={tab.id}
//                       onClick={() => setActiveTab(tab.id)}
//                       className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                         activeTab === tab.id
//                           ? 'bg-white shadow-md text-blue-600'
//                           : 'text-gray-600 hover:text-gray-800'
//                       }`}
//                     >
//                       {tab.icon} {tab.label.replace(/^.+ /, '')}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Tab Content */}
//               <div className="min-h-[400px]">
//                 {activeTab === 'overview' && renderOverview()}
//                 {activeTab !== 'overview' && report.categories[activeTab as keyof typeof report.categories] && 
//                   renderCategoryDetails(activeTab, report.categories[activeTab as keyof typeof report.categories])}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

// pages/index.tsx
import { useState } from 'react'


interface Finding {
  id: string
  check: string
  status: 'pass' | 'fail' | 'warn'
  value: string
  recommendation: string
  priority?: 'high' | 'medium' | 'low'
  impact?: string
  howToFix?: string[]
  codeExample?: string
}

interface CategoryData {
  status: string
  findings: Finding[]
  score: number
  totalChecks: number
}

interface ReportData {
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

export default function Home() {
  const [url, setUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [report, setReport] = useState<ReportData | null>(null)
  const [activeTab, setActiveTab] = useState<string>('overview')

  const handleAnalyze = async () => {
    setError('')
    setReport(null)

    if (!url || !/^https?:\/\/.+/.test(url)) {
      setError('Please enter a valid URL (must start with http:// or https://)')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (!data.success) throw new Error(data.message)
      setReport(data.data)
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    if (status === 'pass') return '✅'
    if (status === 'fail') return '❌'
    return '⚠️'
  }

  const getPriorityColor = (priority?: string) => {
    if (priority === 'high') return 'text-red-600 bg-red-100'
    if (priority === 'medium') return 'text-yellow-600 bg-yellow-100'
    return 'text-blue-600 bg-blue-100'
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

//   const generatePDFReport = () => {
//     if (!report) return

//     const reportContent = `
// SEO ANALYSIS REPORT
// ===================

// Website: ${url}
// Analysis Date: ${new Date().toLocaleDateString()}
// Analysis Time: ${report.analysisTime}ms
// Overall Score: ${report.overallScore}/100

// SUMMARY
// -------
// ✅ Passed Checks: ${report.totalIssues.passed}
// ⚠️ Warnings: ${report.totalIssues.warnings}
// ❌ Critical Issues: ${report.totalIssues.critical}

// PRIORITY RECOMMENDATIONS
// ------------------------
// ${report.suggestions.map(s => `• ${s}`).join('\n')}

// DETAILED ANALYSIS
// =================

// ${Object.entries(report.categories).map(([category, data]) => `
// ${category.replace(/([A-Z])/g, ' $1').toUpperCase()} (${data.score}%)
// ${'='.repeat(category.length + 10)}

// ${data.findings.map(finding => `
// ${finding.status === 'pass' ? '✅' : finding.status === 'warn' ? '⚠️' : '❌'} ${finding.check}
// Priority: ${finding.priority || 'N/A'}
// Status: ${finding.value}
// Impact: ${finding.impact || 'N/A'}
// Recommendation: ${finding.recommendation}
// ${finding.howToFix ? `\nHow to Fix:\n${finding.howToFix.map(fix => `  • ${fix}`).join('\n')}` : ''}
// ${finding.codeExample ? `\nCode Example:\n${finding.codeExample}` : ''}
// `).join('\n')}
// `).join('\n')}

// Generated by Advanced SEO Site Analyzer
//     `.trim()

//     // Create and download the PDF-like text file
//     const blob = new Blob([reportContent], { type: 'text/plain' })
//     const downloadUrl = URL.createObjectURL(blob)
//     const link = document.createElement('a')
//     link.href = downloadUrl
//     link.download = `seo-report-${new URL(url).hostname}-${new Date().toISOString().split('T')[0]}.txt`
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//     URL.revokeObjectURL(downloadUrl)
//   }



const generatePDFReport = async () => {
  if (!report) return;

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  const fontSize = 11; // roughly 14px
  doc.setFontSize(fontSize);

  const lineHeight = 2; // slightly bigger for spacing
  const margin = 10;
  const maxY = 297 - margin;
  const maxLineWidth = 180;
  let y = margin;

  const addLine = (text = '', options: { bold?: boolean } = {}) => {
    if (options.bold) doc.setFont('helvetica', 'bold');
    else doc.setFont('helvetica', 'normal');

    const lines = doc.splitTextToSize(text, maxLineWidth);
    lines.forEach((line: string | string[]) => {
      if (y + lineHeight > maxY) {
        doc.addPage();
        doc.setFontSize(fontSize); // reset after page break
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
    y += 4;
  };

  addLine('SEO ANALYSIS REPORT', { bold: true });
  addLine(`Website: ${url}`);
  addLine(`Analysis Date: ${new Date().toLocaleDateString()}`);
  addLine(`Analysis Time: ${report.analysisTime}ms`);
  addLine(`Overall Score: ${report.overallScore}/100`);
  addLine();

  addLine('SUMMARY', { bold: true });
  addLine(`✅ Passed Checks: ${report.totalIssues.passed}`);
  addLine(`⚠️ Warnings: ${report.totalIssues.warnings}`);
  addLine(`❌ Critical Issues: ${report.totalIssues.critical}`);
  addLine();

  if (report.suggestions.length) {
    addLine('PRIORITY RECOMMENDATIONS', { bold: true });
    report.suggestions.forEach((s) => addLine(`• ${s}`));
    addLine();
  }

  addLine('DETAILED ANALYSIS', { bold: true });
  Object.entries(report.categories).forEach(([category, data]) => {
    const sectionTitle = `${category.replace(/([A-Z])/g, ' $1').toUpperCase()} (${data.score}%)`;
    addLine(sectionTitle, { bold: true });

    data.findings.forEach((finding) => {
      const icon = finding.status === 'pass' ? '✅' : finding.status === 'warn' ? '⚠️' : '❌';
      addLine(`${icon} ${finding.check}`);
      addLine(`Priority: ${finding.priority || 'N/A'}`);
      addLine(`Status: ${finding.value}`);
      addLine(`Impact: ${finding.impact || 'N/A'}`);
      addLine(`Recommendation: ${finding.recommendation}`);

      if (finding.howToFix?.length) {
        addLine('How to Fix:');
        finding.howToFix.forEach((fix) => addLine(`  • ${fix}`));
      }

      if (finding.codeExample) {
        addLine('Code Example:');
        addLine(finding.codeExample);
      }

      addLine();
    });
  });

  addLine('Generated by Refinix.in Advanced SEO Site Analyzer', { bold: true });

  const filename = `seo-report-${new URL(url).hostname}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};



  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <h3 className="font-semibold text-green-800">Passed Checks</h3>
          <p className="text-2xl font-bold text-green-600">{report?.totalIssues.passed}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
          <h3 className="font-semibold text-yellow-800">Warnings</h3>
          <p className="text-2xl font-bold text-yellow-600">{report?.totalIssues.warnings}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <h3 className="font-semibold text-red-800">Critical Issues</h3>
          <p className="text-2xl font-bold text-red-600">{report?.totalIssues.critical}</p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-3">🎯 Priority Recommendations</h3>
        <ul className="space-y-2">
          {report?.suggestions.map((suggestion, index) => (
            <li key={index} className="text-blue-700 flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(report?.categories || {}).map(([category, data]) => (
          <div key={category} className="bg-white p-4 rounded-xl border shadow-sm">
            <h4 className="font-semibold capitalize mb-2">
              {category.replace(/([A-Z])/g, ' $1')}
            </h4>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
                {data.score}%
              </span>
              <span className="text-sm text-gray-500">
                {data.findings.filter(f => f.status === 'pass').length}/{data.totalChecks} passed
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCategoryDetails = (categoryKey: string, categoryData: CategoryData) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold capitalize">
          {categoryKey.replace(/([A-Z])/g, ' $1')} Analysis
        </h3>
        <div className={`text-2xl font-bold ${getScoreColor(categoryData.score)}`}>
          {categoryData.score}%
        </div>
      </div>
      
      <div className="space-y-3">
        {categoryData.findings.map((finding) => (
          <div
            key={finding.id}
            className="p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getStatusIcon(finding.status)}</span>
                  <h4 className="font-semibold">{finding.check}</h4>
                  {finding.priority && (
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(finding.priority)}`}>
                      {finding.priority} priority
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{finding.value}</p>
                {finding.impact && (
                  <p className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-lg mb-2">
                    💡 Impact: {finding.impact}
                  </p>
                )}
                {finding.recommendation && (
                  <p className="text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-lg mb-2">
                    🔧 {finding.recommendation}
                  </p>
                )}
                {finding.howToFix && finding.status !== 'pass' && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2">🛠️ How to Fix:</h5>
                    <div className="text-sm text-green-700 space-y-1">
                      {finding.howToFix.map((fix, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          <span>{fix}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {finding.codeExample && finding.status !== 'pass' && (
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2">📝 Code Example:</h5>
                    <pre className="text-sm text-gray-700 bg-gray-100 p-2 rounded overflow-x-auto">
                      <code>{finding.codeExample}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'onPageSEO', label: '📝 On-Page SEO', icon: '📝' },
    { id: 'technicalSEO', label: '⚙️ Technical SEO', icon: '⚙️' },
    { id: 'performance', label: '🚀 Performance', icon: '🚀' },
    { id: 'accessibility', label: '♿ Accessibility', icon: '♿' },
    { id: 'contentQuality', label: '📋 Content Quality', icon: '📋' },
    { id: 'mobileFriendly', label: '📱 Mobile Friendly', icon: '📱' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
              🔍 Advanced SEO Site Analyzer
            </h1>
            <p className="text-center text-blue-100 text-lg">
              Comprehensive website analysis with actionable insights
            </p>
          </div>

          {/* Input Section */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., https://example.com)"
                className="flex-1 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:opacity-90 transition disabled:opacity-60 font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </span>
                ) : (
                  '🔍 Analyze Website'
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 text-red-600 bg-red-100 p-4 rounded-xl border border-red-200">
                ❌ {error}
              </div>
            )}
          </div>

          {/* Results */}
          {report && (
            <div className="p-6">
              {/* Score Header */}
              <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">SEO Analysis Results</h2>
                    <div className={`text-5xl font-bold mb-2 ${getScoreColor(report.overallScore)}`}>
                      {report.overallScore}/100
                    </div>
                    <p className="text-gray-600">
                      Analysis completed in {report.analysisTime}ms
                    </p>
                  </div>
                  <button
                    onClick={generatePDFReport}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg flex items-center gap-2"
                  >
                    📄 Download Report
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-white shadow-md text-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {tab.icon} {tab.label.replace(/^.+ /, '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'overview' && renderOverview()}
                {activeTab !== 'overview' && report.categories[activeTab as keyof typeof report.categories] && 
                  renderCategoryDetails(activeTab, report.categories[activeTab as keyof typeof report.categories])}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}