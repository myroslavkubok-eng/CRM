namespace CRMKatia.Application.Commands.Interfaces;

public interface ICommandDispatcher
{
    Task<TResult> DispatchAsync<TResult>(ICommand<TResult> command);
}
