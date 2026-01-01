using Backend.Domain.Enums;

namespace Backend.Application.Interfaces
{
    public interface IPricingService
    {
        Task<decimal> CalculateShippingCostAsync(
            decimal weight,
            decimal distance,
            ServiceType serviceType);
    }
}

