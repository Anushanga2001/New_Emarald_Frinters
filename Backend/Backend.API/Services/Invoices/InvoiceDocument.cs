using Backend.Domain.Entities;
using Backend.Domain.Enums;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Backend.API.Services.Invoices
{
    public class InvoiceDocument : IDocument
    {
        private readonly Quote _quote;

        public InvoiceDocument(Quote quote)
        {
            _quote = quote;
        }

        public DocumentMetadata GetMetadata() => new()
        {
            Title = $"Invoice {_quote.QuoteNumber}",
            Author = CompanyInfo.Name,
        };

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(t => t.FontSize(10).FontColor(Colors.Grey.Darken3));

                page.Header().Element(ComposeHeader);
                page.Content().PaddingVertical(20).Element(ComposeContent);
                page.Footer().Element(ComposeFooter);
            });
        }

        private void ComposeHeader(IContainer container)
        {
            container.Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text(CompanyInfo.Name)
                        .FontSize(18).Bold().FontColor(Colors.Blue.Darken3);
                    col.Item().Text(CompanyInfo.Tagline)
                        .FontSize(9).Italic().FontColor(Colors.Grey.Darken1);
                    col.Item().PaddingTop(8).Text(CompanyInfo.AddressLine).FontSize(9);
                    col.Item().Text(CompanyInfo.CityCountry).FontSize(9);
                    col.Item().Text($"Tel: {CompanyInfo.Phone} / {CompanyInfo.Mobile}").FontSize(9);
                    col.Item().Text(CompanyInfo.Email).FontSize(9);
                });

                row.ConstantItem(180).AlignRight().Column(col =>
                {
                    col.Item().AlignRight().Text("INVOICE")
                        .FontSize(28).Bold().FontColor(Colors.Blue.Darken3);
                    col.Item().PaddingTop(8).AlignRight().Text(t =>
                    {
                        t.Span("Invoice #: ").SemiBold();
                        t.Span(_quote.QuoteNumber);
                    });
                    col.Item().AlignRight().Text(t =>
                    {
                        t.Span("Issued: ").SemiBold();
                        t.Span((_quote.BookedAt ?? _quote.CreatedAt).ToString("dd MMM yyyy"));
                    });
                    col.Item().AlignRight().Text(t =>
                    {
                        t.Span("Status: ").SemiBold();
                        t.Span(_quote.Status.ToString())
                            .FontColor(_quote.Status == QuoteStatus.Approved
                                ? Colors.Green.Darken2
                                : Colors.Grey.Darken2);
                    });
                });
            });
        }

        private void ComposeContent(IContainer container)
        {
            container.Column(col =>
            {
                col.Spacing(18);

                col.Item().Element(ComposeBillTo);
                col.Item().Element(ComposeShipmentTable);
                col.Item().AlignRight().Element(ComposeTotals);
                col.Item().Element(ComposeNotes);
            });
        }

        private void ComposeBillTo(IContainer container)
        {
            container.Background(Colors.Grey.Lighten4).Padding(12).Column(col =>
            {
                col.Item().Text("BILL TO").FontSize(9).SemiBold().FontColor(Colors.Grey.Darken2);
                col.Item().PaddingTop(4);

                if (_quote.User is { } user)
                {
                    var fullName = $"{user.FirstName} {user.LastName}".Trim();
                    if (!string.IsNullOrWhiteSpace(fullName))
                        col.Item().Text(fullName).SemiBold().FontSize(11);

                    if (!string.IsNullOrWhiteSpace(user.CompanyName))
                        col.Item().Text(user.CompanyName);

                    if (!string.IsNullOrWhiteSpace(user.BillingAddress))
                        col.Item().Text(user.BillingAddress);

                    if (!string.IsNullOrWhiteSpace(user.TaxId))
                        col.Item().Text($"Tax ID: {user.TaxId}");

                    if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
                        col.Item().Text(user.PhoneNumber);

                    col.Item().Text(user.Email);
                }
                else
                {
                    col.Item().Text("Walk-in customer").Italic();
                }
            });
        }

        private void ComposeShipmentTable(IContainer container)
        {
            container.Table(table =>
            {
                table.ColumnsDefinition(c =>
                {
                    c.RelativeColumn(2);
                    c.RelativeColumn(3);
                    c.ConstantColumn(80);
                    c.ConstantColumn(90);
                });

                table.Header(header =>
                {
                    header.Cell().Element(HeaderCell).Text("Field");
                    header.Cell().Element(HeaderCell).Text("Detail");
                    header.Cell().Element(HeaderCell).AlignRight().Text("Qty / Value");
                    header.Cell().Element(HeaderCell).AlignRight().Text("Unit");

                    static IContainer HeaderCell(IContainer c) =>
                        c.DefaultTextStyle(t => t.SemiBold().FontColor(Colors.White))
                         .Background(Colors.Blue.Darken3)
                         .PaddingVertical(6).PaddingHorizontal(8);
                });

                AddRow(table, "Service", FormatService(_quote.ServiceType), "—", "—");
                AddRow(table, "Route", $"{_quote.Origin}  →  {_quote.Destination}",
                    _quote.Distance.ToString("N0"), "km");
                AddRow(table, "Cargo", _quote.CargoType, _quote.Weight.ToString("N2"), "kg");
                if (!string.IsNullOrWhiteSpace(_quote.ContainerSize))
                    AddRow(table, "Container", _quote.ContainerSize!, "1", "unit");
                AddRow(table, "Estimated transit", $"{_quote.EstimatedDays} days", "—", "—");
            });
        }

        private static void AddRow(TableDescriptor table, string field, string detail, string qty, string unit)
        {
            table.Cell().Element(BodyCell).Text(field).SemiBold();
            table.Cell().Element(BodyCell).Text(detail);
            table.Cell().Element(BodyCell).AlignRight().Text(qty);
            table.Cell().Element(BodyCell).AlignRight().Text(unit);
        }

        private static IContainer BodyCell(IContainer c) =>
            c.BorderBottom(1).BorderColor(Colors.Grey.Lighten2)
             .PaddingVertical(6).PaddingHorizontal(8);

        private void ComposeTotals(IContainer container)
        {
            container.Width(240).Column(col =>
            {
                col.Item().Row(r =>
                {
                    r.RelativeItem().Text("Subtotal").FontSize(10);
                    r.ConstantItem(110).AlignRight()
                        .Text($"{_quote.Currency} {_quote.Price:N2}").FontSize(10);
                });
                col.Item().PaddingVertical(4).BorderBottom(1).BorderColor(Colors.Grey.Lighten1);
                col.Item().Row(r =>
                {
                    r.RelativeItem().Text("Total").FontSize(13).Bold();
                    r.ConstantItem(110).AlignRight()
                        .Text($"{_quote.Currency} {_quote.Price:N2}")
                        .FontSize(13).Bold().FontColor(Colors.Blue.Darken3);
                });
            });
        }

        private static void ComposeNotes(IContainer container)
        {
            container.Background(Colors.Blue.Lighten5).Padding(10).Column(col =>
            {
                col.Item().Text("Notes").SemiBold().FontSize(9).FontColor(Colors.Blue.Darken3);
                col.Item().PaddingTop(2).Text(
                    "This invoice is auto-generated for the booked quote. Please contact us for any clarifications. " +
                    "Payment terms and bank details will be communicated separately."
                ).FontSize(9);
            });
        }

        private static void ComposeFooter(IContainer container)
        {
            container.BorderTop(1).BorderColor(Colors.Grey.Lighten2).PaddingTop(8)
                .Row(row =>
                {
                    row.RelativeItem().Text(t =>
                    {
                        t.Span($"{CompanyInfo.Name} · ").FontSize(8).FontColor(Colors.Grey.Darken1);
                        t.Span($"{CompanyInfo.AddressLine}, {CompanyInfo.CityCountry}")
                            .FontSize(8).FontColor(Colors.Grey.Darken1);
                    });
                    row.ConstantItem(80).AlignRight().Text(t =>
                    {
                        t.CurrentPageNumber().FontSize(8);
                        t.Span(" / ").FontSize(8);
                        t.TotalPages().FontSize(8);
                    });
                });
        }

        private static string FormatService(ServiceType service) => service switch
        {
            ServiceType.SeaFreightFCL => "Sea Freight (FCL)",
            ServiceType.SeaFreightLCL => "Sea Freight (LCL)",
            ServiceType.AirFreight => "Air Freight",
            ServiceType.LandTransport => "Land Transportation",
            ServiceType.Standard => "Standard",
            ServiceType.Express => "Express",
            ServiceType.Overnight => "Overnight",
            _ => service.ToString(),
        };
    }
}
