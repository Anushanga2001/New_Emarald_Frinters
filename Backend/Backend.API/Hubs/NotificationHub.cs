using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Backend.API.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");

                var role = Context.User?.FindFirstValue(ClaimTypes.Role);
                if (role == "Admin")
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "admins");
                }
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != null)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user-{userId}");

                var role = Context.User?.FindFirstValue(ClaimTypes.Role);
                if (role == "Admin")
                {
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, "admins");
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
