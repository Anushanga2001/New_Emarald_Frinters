import { useState, useEffect, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community'
import { toast } from 'sonner'
import { FileSpreadsheet, RefreshCw, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getUserQuotes } from '@/services/quote.service'
import { formatCurrency } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import type { Quote } from '@/types'

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
      toast.error('Failed to load quotes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  // Admin actions for quotes
  const handleApproveQuote = async (quoteId: string) => {
    try {
      // API call would go here: await approveQuote(quoteId)
      toast.success(`Quote ${quoteId} approved`)
      fetchQuotes()
    } catch {
      toast.error('Failed to approve quote')
    }
  }

  const handleRejectQuote = async (quoteId: string) => {
    try {
      // API call would go here: await rejectQuote(quoteId)
      toast.success(`Quote ${quoteId} rejected`)
      fetchQuotes()
    } catch {
      toast.error('Failed to reject quote')
    }
  }

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      // API call would go here: await deleteQuote(quoteId)
      toast.success(`Quote ${quoteId} deleted`)
      fetchQuotes()
    } catch {
      toast.error('Failed to delete quote')
    }
  }

  // Admin actions cell renderer
  const AdminActionsCellRenderer = (params: ICellRendererParams<Quote>) => {
    if (!isAdmin || !params.data?.id) return null
    
    return (
      <div className="flex items-center gap-1 h-full">
        <button
          onClick={() => handleApproveQuote(params.data!.id!)}
          className="p-1 text-green-600 hover:bg-green-50 rounded"
          title="Approve"
        >
          <CheckCircle className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleRejectQuote(params.data!.id!)}
          className="p-1 text-amber-600 hover:bg-amber-50 rounded"
          title="Reject"
        >
          <XCircle className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleDeleteQuote(params.data!.id!)}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    )
  }

  const GridExample = () => {
    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([
        { make: "Tesla", model: "Model Y", price: 64950, electric: true },
        { make: "Ford", model: "F-Series", price: 33850, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ]);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        { field: "make" },
        { field: "model" },
        { field: "price" },
        { field: "electric" }
    ]);
}

  const columnDefs = useMemo<ColDef<Quote>[]>(() => {
    const baseCols: ColDef<Quote>[] = [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 50,
        pinned: 'left',
        suppressHeaderMenuButton: true,
        headerName: ''
      },
      { 
        field: 'id', 
        headerName: 'Quote', 
        width: 160,
      },
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
      }
    ]

    // Add admin actions column if user is admin
    if (isAdmin) {
      baseCols.push({
        headerName: 'Actions',
        width: 120,
        pinned: 'right',
        cellRenderer: AdminActionsCellRenderer,
        sortable: false,
        filter: false,
        suppressHeaderMenuButton: true
      })
    }

    return baseCols
  }, [isAdmin])

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
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
          <Button 
            variant="outline" 
            onClick={fetchQuotes}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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
              rowSelection="multiple"
              suppressCellFocus={true}
              rowHeight={48}
              headerHeight={48}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
