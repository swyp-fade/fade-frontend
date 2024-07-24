import profileDefaultImage1 from '@Assets/profile_default_1.jpg';
import profileDefaultImage2 from '@Assets/profile_default_2.jpg';
import profileDefaultImage3 from '@Assets/profile_default_3.jpg';
import profileDefaultImage4 from '@Assets/profile_default_4.jpg';

const defaultProfileImages = [profileDefaultImage1, profileDefaultImage2, profileDefaultImage3, profileDefaultImage4];

export function RandomAvatar() {
  const randomProfileImage = defaultProfileImages.at(Math.floor(Math.random() * 4));
  return <div style={{ backgroundImage: `url('${randomProfileImage}')` }} className="size-8 rounded-lg" />;
}
