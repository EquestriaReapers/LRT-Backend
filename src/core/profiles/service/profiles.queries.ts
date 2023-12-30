export const SET_SEED_QUERY = `SELECT 0
    FROM (
          SELECT setseed({{randomSeed}})
        ) AS randomization_seed;`;

export const RANDOM_PROFILES_PAGINATE_QUERY = `
    SELECT "profile"."id" AS "profile_id", "profile"."userId" AS "profile_userId", "profile"."description" AS "profile_description", "profile"."mainTitle" AS "profile_mainTitle", "profile"."countryResidence" AS "profile_countryResidence", "profile"."deletedAt" AS "profile_deletedAt", "user"."id" AS "user_id", "user"."name" AS "user_name", "user"."lastname" AS "user_lastname", "user"."email" AS "user_email",
      ARRAY(
        SELECT DISTINCT ON ("experience"."id") json_build_object(
          'id', "experience"."id",
          'profileId', "experience"."profileId",
          'businessName', "experience"."businessName",
          'location', "experience"."location",
          'role', "experience"."role",
          'startDate', "experience"."startDate",
          'endDate', "experience"."endDate"
        )::text
        FROM "experience"
        WHERE "experience"."profileId" = "profile"."id" AND "experience"."deletedAt" IS NULL
      ) AS "experiences",
      ARRAY(
        SELECT DISTINCT ON ("skills"."id") json_build_object(
          'id', "skills"."id",
          'name', "skills"."name"
        )::text
        FROM "profile_skills_skill" "profile_skills"
        JOIN "skill" "skills" ON "skills"."id"="profile_skills"."skillId"
        WHERE "profile_skills"."profileId" = "profile"."id"
      ) AS "skills",
      ARRAY(
        SELECT DISTINCT ON ("language_profile"."id") json_build_object(
          'id', "language_profile"."id",
          'profileId', "language_profile"."profileId",
          'level', "language_profile"."level",
          'name', "languages"."name",
          'languageId', "language_profile"."languageId"
        )::text
        FROM "language_profile"
        JOIN "language" "languages" ON "languages"."id"="language_profile"."languageId"
        WHERE "language_profile"."profileId" = "profile"."id"
      ) AS "languageProfile"
    FROM "profile" "profile"
    LEFT JOIN "user" "user" ON "user"."id"="profile"."userId" AND ("user"."deletedAt" IS NULL)
    WHERE "profile"."deletedAt" IS NULL
    GROUP BY "profile"."id", "user"."id"
    ORDER BY RANDOM()
    LIMIT {{limit}} OFFSET {{skip}}
`;
