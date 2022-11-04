package systems.fervento.sportsclub.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

import java.util.Objects;
import java.util.Optional;
import java.util.function.Supplier;

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
    public Page<NotificationData> getAllUserNotificationsByUserId(
        Integer pageNo,
        Integer pageSize,
        final long ownerId,
        final Optional<Boolean> filterByHasBeenRead
    ) {
        if (!userRepository.existsById(ownerId)) {
            throw new ResourceNotFoundException("The provided id doesn't identify any user!");
        }

        final Pageable pageRequest = PageRequest.of(pageNo, pageSize);

        final Supplier<Page<NotificationEntity>> getUserNotificationsPage = (filterByHasBeenRead.isEmpty())
            ? () -> notificationRepository.findAllByOwnerId(pageRequest, ownerId)
            : () -> notificationRepository.findAllByOwnerIdAndHasBeenRead(pageRequest, ownerId, filterByHasBeenRead.get());

        return getUserNotificationsPage.get()
            .map(notificationDataMapper::mapToNotificationData);
    }
}
