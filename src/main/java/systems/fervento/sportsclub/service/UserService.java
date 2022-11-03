package systems.fervento.sportsclub.service;

import org.springframework.stereotype.Service;
import systems.fervento.sportsclub.data.UserData;
import systems.fervento.sportsclub.mapper.UserDataMapper;
import systems.fervento.sportsclub.mapper.UserEntityMapper;
import systems.fervento.sportsclub.repository.UserRepository;

import java.util.Objects;

@Service
public class UserService {
    private final UserRepository userRepository;

    private final UserDataMapper userDataMapper = UserDataMapper.INSTANCE;
    private final UserEntityMapper userEntityMapper = UserEntityMapper.INSTANCE;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserData registerUser(UserData user) {
        Objects.requireNonNull(user);
        var userEntity = userEntityMapper.mapToUserEntity(user);
        userRepository.save(userEntity);
        return userDataMapper.map(userEntity);
    }
}
