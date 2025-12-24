using Shipping_Line_Backend.Domain.Enums;

namespace Shipping_Line_Backend.Application.Interfaces
{
    public interface IPricingService
    {
        Task<decimal> CalculateShippingCostAsync(
            decimal weight,
            decimal distance,
            ServiceType serviceType);
    }
}
