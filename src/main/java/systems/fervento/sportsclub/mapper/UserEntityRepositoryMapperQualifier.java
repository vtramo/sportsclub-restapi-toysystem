package systems.fervento.sportsclub.mapper;

import org.mapstruct.Named;
import org.springframework.stereotype.Component;
import systems.fervento.sportsclub.entity.UserEntity;
import systems.fervento.sportsclub.repository.UserRepository;

@Component
public class UserEntityRepositoryMapperQualifier {
    private final UserRepository userRepository;

    public UserEntityRepositoryMapperQualifier(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Named("getUserEntityById")
    public UserEntity getUserEntityById(final Long userId) {
        return userRepository.findById(userId).orElseThrow();
    }
}
