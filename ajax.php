<?php
if(isset($_POST['inputData'])) {
  $username = $_POST['inputData'];

  function fetchFromGitHubAPI($url) {
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_4_5; like Mac OS X) AppleWebKit/603.39 (KHTML, like Gecko)  Chrome/50.0.1900.263 Mobile Safari/533.7');
      $output = curl_exec($ch);
      curl_close($ch);
      return json_decode($output, true);
  }

  $userRepos = fetchFromGitHubAPI("https://api.github.com/users/$username/repos");

  $userData = fetchFromGitHubAPI("https://api.github.com/users/$username");

  $totalRepos = count($userRepos);
  $starsArray = array_column($userRepos, 'stargazers_count');
  $forksArray = array_column($userRepos, 'forks_count');

  $maxStars = max($starsArray);
  $maxStarredRepoKey = array_search($maxStars, $starsArray);
  $mostStarredRepo = $userRepos[$maxStarredRepoKey]['name'];

  $maxForks = max($forksArray);
  $maxForkedRepoKey = array_search($maxForks, $forksArray);
  $mostForkedRepo = $userRepos[$maxForkedRepoKey]['name'];

  $starredReposList = array_column($userRepos, 'stargazers_count', 'name');
  arsort($starredReposList);
  $starredRepos = array_keys(array_slice($starredReposList, 0, 5, true));

  $forkedReposList = array_column($userRepos, 'forks_count', 'name');
  arsort($forkedReposList);
  $forkedRepos = array_keys(array_slice($forkedReposList, 0, 5, true));

  $followers = $userData['followers'];
  $avatarUrl = $userData['avatar_url'];
  $githubName = $userData['login'];
  $name = $userData['name'];

  $responseData = array(
    'totalRepos' => $totalRepos,
    'mostStarredRepo' => $mostStarredRepo,
    'mostForkedRepo' => $mostForkedRepo,
    'followers' => $followers,
    'avatarUrl' => $avatarUrl,
    'githubName' => $githubName,
    'name' => $name,
    'starredRepos' => $starredRepos,
    'forkedRepos' => $forkedRepos
  );

  echo json_encode($responseData);

} else {
  echo "Veri bulunamadı.";
}
?>
