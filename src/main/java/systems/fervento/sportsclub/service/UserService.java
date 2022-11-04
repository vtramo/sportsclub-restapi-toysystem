package systems.fervento.sportsclub.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import systems.fervento.sportsclub.data.NotificationData;
import systems.fervento.sportsclub.data.UserData;
import systems.fervento.sportsclub.entity.NotificationEntity;
import systems.fervento.sportsclub.exception.ResourceNotFoundException;
import systems.fervento.sportsclub.mapper.NotificationDataMapper;
import systems.fervento.sportsclub.mapper.UserDataMapper;
import systems.fervento.sportsclub.mapper.UserEntityMapper;
import systems.fervento.sportsclub.repository.NotificationRepository;
import systems.fervento.sportsclub.repository.UserRepository;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationDataMapper notificationDataMapper = NotificationDataMapper.INSTANCE;
    private final UserDataMapper userDataMapper = UserDataMapper.INSTANCE;
    private final UserEntityMapper userEntityMapper = UserEntityMapper.INSTANCE;

    public UserService(UserRepository userRepository, NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    public UserData registerUser(UserData user) {
        Objects.requireNonNull(user);
        var userEntity = userEntityMapper.mapToUserEntity(user);
        userRepository.save(userEntity);
        return userDataMapper.map(userEntity);
    }

    @Transactional(readOnly = true)
    public List<NotificationData> getAllUserNotificationsByUserId(final long ownerId) {
        if (!userRepository.existsById(ownerId)) {
            throw new ResourceNotFoundException("The provided id doesn't identify any user!");
        }

        try (final Stream<NotificationEntity> notificationsStream = notificationRepository.findAllByOwnerId(ownerId)) {
            return notificationsStream
                .map(notificationDataMapper::mapToNotificationData)
                .collect(toList());
        }
    }
}
