@org.hibernate.annotations.GenericGenerator(
    name = "ID_GENERATOR",
    strategy = "enhanced-sequence",
    parameters = {
        @org.hibernate.annotations.Parameter(
                name = "sequence_name",
                value = "WEPLAY_SEQUENCE"
        ),
        @org.hibernate.annotations.Parameter(
                name = "initial_value",
                value = "1000"
        )
    }
)

/* Sports Facility Entity Queries */
/*@NamedNativeQueries(value = {
    @NamedNativeQuery(
            name = "SportsFacilityEntity.findAllByTotalNumberSportsFieldsBetween",
            query = "SELECT * FROM sports_facility_entity sf LEFT JOIN " +
                    "(SELECT spf.sports_facility_id, COUNT(spf.sports_facility_id) AS tot " +
                    "FROM sports_field_entity spf GROUP BY spf.sports_facility_id HAVING tot BETWEEN :min AND :max) AS sq " +
                    "ON sf.id = sq.sports_facility_id WHERE COALESCE(sports_facility_id, 0) <> (CASE WHEN :min = 0 THEN -1 ELSE 0 END)",
            resultClass = SportsFacilityEntity.class
    ),
    @NamedNativeQuery(
        name = "SportsFacilityEntity.findAllByOwnerIdAndTotalNumberSportsFieldsBetween",
        query = "SELECT * FROM sports_facility_entity sf LEFT JOIN " +
                "(SELECT spf.sports_facility_id, COUNT(spf.sports_facility_id) AS tot " +
                "FROM sports_field_entity spf GROUP BY spf.sports_facility_id HAVING tot BETWEEN :min AND :max) AS sq " +
                "ON sf.id = sq.sports_facility_id " +
                "WHERE COALESCE(sports_facility_id, 0) <> (CASE WHEN :min = 0 THEN -1 ELSE 0 END) " +
                "AND owner_id = :ownerId",
        resultClass = SportsFacilityEntity.class
    )
})*/

@NamedQueries({
    @NamedQuery(
            name = "SportsFacilityEntity.findAllByTotalNumberSportsFieldsBetween",
            query = "SELECT sf FROM SportsFacilityEntity sf WHERE sf.sportsFields.size > :min AND sf.sportsFields.size < :max"
    ),
    @NamedQuery(
            name = "SportsFacilityEntity.findAllByOwnerIdAndTotalNumberSportsFieldsBetween",
            query = "SELECT sf FROM SportsFacilityEntity sf WHERE sf.owner.id = :ownerId " +
                    "AND sf.sportsFields.size > :min AND sf.sportsFields.size < :max"
    )
})

package systems.fervento.sportsclub.repository;

import org.hibernate.annotations.NamedQueries;
import org.hibernate.annotations.NamedQuery;