using System.Collections.Concurrent;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace InfrastructureAPI.Hubs;

[Authorize]
public class NotificacionesHub : Hub
{
    // Mapa thread-safe userId → connectionId
    private static readonly ConcurrentDictionary<string, string> UserConnections = new();

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userId))
            UserConnections[userId] = Context.ConnectionId;

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userId))
            UserConnections.TryRemove(userId, out _);

        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>Broadcast a todos los clientes conectados.</summary>
    public async Task SendNotification(string mensaje, string tipo = "info")
    {
        await Clients.All.SendAsync("ReceiveNotification", new
        {
            message = mensaje,
            type = tipo,
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>Enviar notificación a un usuario específico.</summary>
    public async Task SendNotificationToUser(string userId, string mensaje, string tipo = "info")
    {
        if (UserConnections.TryGetValue(userId, out var connectionId))
        {
            await Clients.Client(connectionId).SendAsync("ReceiveNotification", new
            {
                message = mensaje,
                type = tipo,
                timestamp = DateTime.UtcNow
            });
        }
    }

    public async Task JoinGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await Clients.Caller.SendAsync("JoinedGroup", groupName);
    }

    public async Task LeaveGroup(string groupName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    }

    public async Task SendToGroup(string groupName, string mensaje)
    {
        await Clients.Group(groupName).SendAsync("ReceiveNotification", new
        {
            message = mensaje,
            timestamp = DateTime.UtcNow
        });
    }
}
