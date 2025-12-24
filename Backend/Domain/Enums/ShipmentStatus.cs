namespace Shipping_Line_Backend.Domain.Enums
{
    public enum ShipmentStatus
    {
        Pending = 1,
        PickedUp = 2,
        InTransit = 3,
        OutForDelivery = 4,
        Delivered = 5,
        Cancelled = 6
    }
}
