// src/types/seo.ts

export type Status = 'pass' | 'fail' | 'warn'

export interface Finding {
  id: string
  check: string
  status: Status
  value: string
  recommendation: string
}

export interface SEOResponse {
  success: boolean
  message: string
  data?: {
    overallScore: number
    categories: {
      onPageSEO: {
        status: string
        findings: Finding[]
      }
      technicalSEO: {
        status: string
        findings: Finding[]
      }
      performance: {
        status: string
        findings: Finding[]
      }
      accessibility: {
        status: string
        findings: Finding[]
      }
    }
  }
}
