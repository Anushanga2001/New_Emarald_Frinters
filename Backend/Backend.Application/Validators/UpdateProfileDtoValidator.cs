using FluentValidation;
using Backend.Application.DTOs.Profile;

namespace Backend.Application.Validators
{
    public class UpdateProfileDtoValidator : AbstractValidator<UpdateProfileDto>
    {
        public UpdateProfileDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .MaximumLength(100).WithMessage("Name must not exceed 100 characters");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Phone)
                .Matches(@"^[\d\s\-+()]*$")
                .WithMessage("Phone can only contain digits, spaces, dashes, parentheses, and +")
                .When(x => !string.IsNullOrEmpty(x.Phone));

            RuleFor(x => x.CompanyName)
                .MaximumLength(200).WithMessage("Company name must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.CompanyName));
        }
    }
}
