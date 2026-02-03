using Backend.Application.DTOs.Profile;

namespace Backend.Application.Interfaces
{
    public interface IProfileService
    {
        Task<ProfileDto> GetProfileAsync(int userId);
        Task<ProfileResponseDto> UpdateProfileAsync(int userId, UpdateProfileDto dto);
    }
}
