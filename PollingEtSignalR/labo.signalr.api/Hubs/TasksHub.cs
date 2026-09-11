using labo.signalr.api.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace labo.signalr.api.Hubs
{
    public class TasksHub : Hub
    {
        private readonly ApplicationDbContext _context;
        public TasksHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task OnConnectionAsync(string connectionId)
        {
            await base.OnConnectedAsync();
            await Clients.All.SendAsync("TaskList", await _context.UselessTasks.ToListAsync());
        }
    }
}
