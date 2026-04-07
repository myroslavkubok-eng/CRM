using CRMKatia.Application.Commands.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace CRMKatia.Application.Commands;

public class CommandDispatcher : ICommandDispatcher
{
    private readonly IServiceProvider _serviceProvider;

    public CommandDispatcher(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public Task<TResult> DispatchAsync<TResult>(ICommand<TResult> command)
    {
        var commandType = command.GetType();
        var handlerType = typeof(ICommandHandler<,>).MakeGenericType(commandType, typeof(TResult));

        dynamic handler = _serviceProvider.GetRequiredService(handlerType);

        return handler.HandleAsync((dynamic)command);
    }
}
