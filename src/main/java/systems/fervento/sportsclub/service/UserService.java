package systems.fervento.sportsclub.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import systems.fervento.sportsclub.repository.UserRepository;

@Slf4j
@Service
public class UserService {

    private final UserRepository userRepository;
    /*private final UserDataMapper userDataMapper = UserDataMapper.INSTANCE;*/

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /*public Optional<UserData> getUserById(Long userId) {
        return userRepository.findById(userId)
                .map(userDataMapper::map);
    }*/
}
