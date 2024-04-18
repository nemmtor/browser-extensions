import { memo, useCallback, useEffect, useState } from 'react';

import { Closable } from 'shared/ui/components';

import { GITCOIN_ICON } from '../../../gitcoin.icon';
import { Application } from '../../donation.types';
import { DonationForm } from '../donation-form';

interface Properties {
  application: Application;
  node: Element;
  username: string;
  iconSize: number;
}

export const DonationWidget = memo(
  ({ application, node, username, iconSize }: Properties) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
      const element = document.createElement('img');
      element.style.height = `${iconSize}px`;
      element.style.width = `${iconSize}px`;
      element.style.marginLeft = '4px';
      element.style.cursor = 'pointer';
      element.src = GITCOIN_ICON;
      node.querySelector('span')?.append(element);
      const updatePosition = () => {
        const elementRect = element.getBoundingClientRect();
        setPosition({
          x: elementRect.right,
          y: elementRect.top + window.scrollY,
        });
      };

      const onClick = (event: MouseEvent) => {
        event.preventDefault();
        setIsVisible(true);
        updatePosition();
      };

      element.addEventListener('click', onClick);
      window.addEventListener('resize', updatePosition);

      return () => {
        element.removeEventListener('click', onClick);
        window.removeEventListener('resize', updatePosition);
        element.remove();
      };
    }, [iconSize, node]);

    const close = useCallback(() => {
      setIsVisible(false);
    }, []);

    if (!isVisible) {
      return null;
    }

    return (
      <Closable
        left={position.x - 16}
        top={position.y + 16}
        onClose={close}
        className="absolute w-64 rounded-md bg-white text-gray-900 shadow-2xl"
        closeButtonClassName="hover:enabled:bg-black/20 active:enabled:bg-black/40"
        closeButtonIconClassName="text-[#000]"
        closeOnClickAway
      >
        <DonationForm
          application={application}
          className="mt-4"
          username={username}
        />
      </Closable>
    );
  },
);

DonationWidget.displayName = 'DonationWidget';
