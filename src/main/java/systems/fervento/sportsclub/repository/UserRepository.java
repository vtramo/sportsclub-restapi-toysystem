package systems.fervento.sportsclub.repository;


import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import systems.fervento.sportsclub.entity.UserEntity;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Long> {
    UserEntity findByUsername(String username);

    @Modifying(clearAutomatically = true)
    @Query("update UserEntity u set u.email = :email where u.id = :id")
    int updateEmail(@Param("id") Long id, @Param("email") String email);

    Optional<UserEntity> findUserEntitiesById(Long id, Sort sort);
}
