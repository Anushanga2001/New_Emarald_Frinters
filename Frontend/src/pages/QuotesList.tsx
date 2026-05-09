import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community'
import * as XLSX from 'xlsx'
import { notify } from '@/lib/toast'
import { FileSpreadsheet, RefreshCw, CheckCircle, XCircle, Eye, Loader2, FileDown, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { approveQuote, downloadInvoice, getUserQuotes, rejectQuote } from '@/services/quote.service'
import { formatCurrency } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import type { Quote, QuoteStatus } from '@/types'

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule])

export function QuotesListPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  const customTheme = themeQuartz
  .withParams({
    browserColorScheme: "light",
    headerFontSize: 14
  })

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      const data = await getUserQuotes()
      setQuotes(data)
    } catch (error) {
      notify.error('Failed to load quotes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  // Track rows currently being updated to show loading state in action cell
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set())

  const handleExportToExcel = () => {
    if (quotes.length === 0) {
      notify.info('No quotes to export')
      return
    }

    const rows = quotes.map((q) => {
      const base: Record<string, string | number> = {
        'Quote #': q.id ?? '',
        'Origin': q.origin,
        'Destination': q.destination,
        'Service': q.service,
        'Cargo Type': q.cargoType,
        'Weight (kg)': q.weight,
        'Container': q.containerSize ?? '',
        'Price': q.price,
        'Currency': q.currency,
        'Estimated Days': q.estimatedDays,
        'Status': q.status ?? 'Pending',
        'Created At': q.createdAt
          ? new Date(q.createdAt).toLocaleString()
          : '',
      }
      if (isAdmin) {
        return { 'Quote #': base['Quote #'], 'Customer': q.customerName ?? '—', ...base }
      }
      return base
    })

    const worksheet = XLSX.utils.json_to_sheet(rows)
    worksheet['!cols'] = Object.keys(rows[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...rows.map((r) => String(r[key as keyof typeof r] ?? '').length),
      ) + 2,
    }))

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Quotes')

    const stamp = new Date().toISOString().slice(0, 10)
    XLSX.writeFile(workbook, `quotes-${stamp}.xlsx`)
  }

  const handleDownloadInvoice = async (quoteNumber: string) => {
    setDownloadingIds((prev) => {
      const next = new Set(prev)
      next.add(quoteNumber)
      return next
    })
    try {
      await downloadInvoice(quoteNumber)
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      notify.error(
        axiosError?.response?.data?.message ||
          `Failed to download invoice ${quoteNumber}`
      )
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev)
        next.delete(quoteNumber)
        return next
      })
    }
  }

  const decideQuote = async (
    quoteNumber: string,
    decision: 'approve' | 'reject'
  ) => {
    setPendingIds((prev) => {
      const next = new Set(prev)
      next.add(quoteNumber)
      return next
    })
    try {
      const updated =
        decision === 'approve'
          ? await approveQuote(quoteNumber)
          : await rejectQuote(quoteNumber)

      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteNumber ? { ...q, status: updated.status } : q))
      )
      notify.success(
        decision === 'approve'
          ? `Quote ${quoteNumber} approved`
          : `Quote ${quoteNumber} rejected`
      )
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      notify.error(
        axiosError?.response?.data?.message ||
          `Failed to ${decision} quote ${quoteNumber}`
      )
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(quoteNumber)
        return next
      })
    }
  }

  // Row actions cell renderer (admin: approve/reject + view + download; customer: download only)
  const ActionsCellRenderer = (params: ICellRendererParams<Quote>) => {
    if (!params.data?.id) return null
    const quoteNumber = params.data.id
    const status: QuoteStatus = params.data.status ?? 'Pending'
    const isPending = pendingIds.has(quoteNumber)
    const isDownloading = downloadingIds.has(quoteNumber)

    if (isPending) {
      return (
        <div className="flex items-center h-full">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )
    }

    const downloadButton = status === 'Approved' ? (
      <button
        onClick={() => handleDownloadInvoice(quoteNumber)}
        disabled={isDownloading}
        className="p-1 text-primary hover:bg-primary/10 rounded disabled:opacity-50"
        title="Download invoice"
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="h-4 w-4" />
        )}
      </button>
    ) : null

    if (isAdmin && status === 'Pending') {
      return (
        <div className="flex items-center gap-1 h-full">
          <button
            onClick={() => decideQuote(quoteNumber, 'approve')}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Approve"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
          <button
            onClick={() => decideQuote(quoteNumber, 'reject')}
            className="p-1 text-amber-600 hover:bg-amber-50 rounded"
            title="Reject"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 h-full">
        {isAdmin && (
          <Link
            to={`/admin/quotes/${quoteNumber}`}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            title="View details"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Link>
        )}
        {downloadButton}
      </div>
    )
  }

  const StatusCellRenderer = (params: ICellRendererParams<Quote>) => {
    const status: QuoteStatus = params.data?.status ?? 'Pending'
    const classes =
      status === 'Approved'
        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
        : status === 'Rejected'
        ? 'bg-red-100 text-red-700 border-red-200'
        : 'bg-amber-100 text-amber-700 border-amber-200'
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${classes}`}
      >
        {status}
      </span>
    )
  }

  const columnDefs = useMemo<ColDef<Quote>[]>(() => {
    const baseCols: ColDef<Quote>[] = [
      {
        field: 'id',
        headerName: 'Quote',
        width: 160,
      },
      ...(isAdmin
        ? [{
            field: 'customerName' as const,
            headerName: 'Customer',
            width: 180,
            valueFormatter: (params: { value?: string | null }) =>
              params.value ?? '—',
          }]
        : []),
      {
        field: 'origin',
        headerName: 'Origin',
        flex: 1,
        minWidth: 130
      },
      { 
        field: 'destination', 
        headerName: 'Destination',
        flex: 1,
        minWidth: 130
      },
      { 
        field: 'service', 
        headerName: 'Service',
        width: 160
      },
      { 
        field: 'cargoType', 
        headerName: 'Cargo Type',
        width: 150
      },
      { 
        field: 'weight', 
        headerName: 'Weight (kg)',
        width: 120,
        type: 'numericColumn',
        valueFormatter: (params) => params.value?.toLocaleString() ?? ''
      },
      { 
        field: 'price', 
        headerName: 'Price',
        width: 140,
        type: 'numericColumn',
        valueFormatter: (params) => {
          if (!params.data) return ''
          return formatCurrency(params.value, params.data.currency)
        },
        cellClass: 'font-semibold'
      },
      { 
        field: 'estimatedDays', 
        headerName: 'Est. Days',
        width: 110,
        type: 'numericColumn',
        valueFormatter: (params) => params.value ? `${params.value} days` : ''
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        width: 130,
        valueFormatter: (params) => {
          if (!params.value) return ''
          return new Date(params.value).toLocaleDateString()
        }
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        cellRenderer: StatusCellRenderer,
        sortable: true,
        filter: false,
      }
    ]

    baseCols.push({
      headerName: 'Actions',
      width: 130,
      pinned: 'right',
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      suppressHeaderMenuButton: true
    })

    return baseCols
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, pendingIds, downloadingIds])

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: false,
    resizable: true,
  }), [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">All Quotes</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportToExcel}
              disabled={loading || quotes.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
            <Button
              variant="outline"
              onClick={fetchQuotes}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">
          View and manage all shipping quotes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quotes List</CardTitle>
          <CardDescription>
            {loading ? 'Loading...' : `${quotes.length} quote${quotes.length !== 1 ? 's' : ''} found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: 500, width: '100%' }}>
            <AgGridReact<Quote>
              rowData={quotes}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              theme={customTheme}
              loading={loading}
              pagination={true}
              paginationPageSize={25}
              paginationPageSizeSelector={[10, 25, 50, 100]}
              animateRows={true}
              enableCellTextSelection={true}
              ensureDomOrder={true}
              rowHeight={48}
              headerHeight={48}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
