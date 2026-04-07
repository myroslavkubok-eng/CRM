namespace CRMKatia.Application.Commands.Interfaces;

public interface ICommand<TResult> { }

public interface ICommandHandler<TCommand, TResult> where TCommand : ICommand<TResult>
{
    Task<TResult> HandleAsync(TCommand command);
}
