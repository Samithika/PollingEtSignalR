using labo.signalr.api.Data;
using labo.signalr.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace labo.signalr.api.Hubs
{
    public class TasksHub : Hub
    {
        private readonly ApplicationDbContext _context;

        // variable privée pour le nb de connexions au hub
        private static HashSet<string> connections = new HashSet<string>();

        public TasksHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();

            var connectionID = Context.ConnectionId;
            if (connectionID != null)
            {
                connections.Add(connectionID);
            }

            await Clients.All.SendAsync("UserCount", connections.Count);
            await Clients.Caller.SendAsync("TaskList", _context.UselessTasks.ToList());
        }

        public async Task AddTaskAsync(string taskName)
        {
            var task = new UselessTask
            {
                Text = taskName
            };
            await _context.UselessTasks.AddAsync(task);
            await _context.SaveChangesAsync();

            // fait un appel vers le client pour lui renvoyer la liste de tasks mise à jour
            await Clients.All.SendAsync("TaskList", _context.UselessTasks.ToList());
        }

        public async Task CompleteTaskAsync(int id)
        {
            var task = await _context.UselessTasks.FindAsync(id);

            if (task != null)
            {
                task.Completed = true;
                await _context.SaveChangesAsync();

                // fait un appel vers le client pour lui renvoyer la liste de tasks mise à jour
                await Clients.All.SendAsync("TaskList", _context.UselessTasks.ToList());
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var connectionID = Context.ConnectionId;
            if (connectionID != null)
            {
                connections.Remove(connectionID);
            }

            await Clients.All.SendAsync("UserCount", connections.Count);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
