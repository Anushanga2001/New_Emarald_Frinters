using Microsoft.EntityFrameworkCore;
using Shipping_Line_Backend.Application.Interfaces;
using Shipping_Line_Backend.Domain.Enums;
using Shipping_Line_Backend.Infrastructure.Data;

namespace Shipping_Line_Backend.Infrastructure.Services
{
    public class PricingService : IPricingService
    {
        private readonly AppDbContext _context;

        public PricingService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<decimal> CalculateShippingCostAsync(
            decimal weight,
            decimal distance,
            ServiceType serviceType)
        {
            var pricingRule = await _context.PricingRules
                .Where(pr => pr.ServiceType == serviceType 
                    && pr.IsActive 
                    && pr.EffectiveFrom <= DateTime.UtcNow
                    && (pr.EffectiveTo == null || pr.EffectiveTo >= DateTime.UtcNow))
                .OrderByDescending(pr => pr.EffectiveFrom)
                .FirstOrDefaultAsync();

            if (pricingRule == null)
            {
                throw new InvalidOperationException($"No active pricing rule found for service type: {serviceType}");
            }

            decimal cost = pricingRule.BaseRate
                + (weight * pricingRule.WeightRatePerKg)
                + (distance * pricingRule.DistanceRatePerKm);

            return Math.Max(cost, pricingRule.MinimumCharge);
        }
    }
}
