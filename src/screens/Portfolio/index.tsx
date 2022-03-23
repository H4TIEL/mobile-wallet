/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {Text, View, TouchableOpacity, ScrollView, Platform} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Colors} from 'utils/colors';
import {observer} from 'mobx-react-lite';
import {styles} from './styles';
import {WalletStore} from 'stores/wallet';
import {formatPrice} from 'utils';
import Portfolios from 'data/portfolios';
import {BankStore} from 'stores/bankStore';
import {FiatStore} from 'stores/fiatStore';
import {CexStore} from 'stores/cexStore';
import {useNavigation} from '@react-navigation/native';
import {SmallLogo} from 'routes';

const PortfolioScreen = observer(() => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const scrollRef: any = useRef();
  const [screen, setScreen] = useState(Portfolios[0]);
  const [shadowHeader, setShadowHeader] = useState(false);
  const [lastOffset, setLastOffset] = useState(0);

  useEffect(() => {
    if (shadowHeader) {
      navigation.setOptions({
        headerTitle: () => (
          <Text
            style={{
              fontSize: 23,
              fontWeight: 'bold',
              fontFamily: 'RobotoSlab-Bold',
              color: Colors.foreground,
            }}>
            {formatPrice(
              WalletStore.totalBalance +
                BankStore.totalBalance +
                FiatStore.totalBalance +
                CexStore.totalBalance,
              true,
            ) || 0.0}
          </Text>
        ),
      });
    } else {
      navigation.setOptions({
        headerTitle: () => <SmallLogo />,
      });
    }
  }, [shadowHeader]);

  const bubble = (item, index) => {
    return (
      <TouchableOpacity
        key={item.title}
        onPress={() => {
          setScreen(item);
          scrollRef.current?.scrollTo({
            x: index * 30,
            animated: true,
          });
          // setShadowHeader(false);
        }}
        style={{
          backgroundColor:
            screen.title === item.title ? Colors.foreground : Colors.darker,
          flex: 1,
          padding: 5,
          paddingHorizontal: 15,
          borderRadius: 15,
          marginHorizontal: 3,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          minWidth: 70,
        }}>
        <Text
          style={{
            fontSize: 14,
            color:
              screen.title === item.title
                ? Colors.background
                : Colors.foreground,
          }}>
          {t(item.title)}
        </Text>
      </TouchableOpacity>
    );
  };

  const onScroll = y => {
    const top = Platform.OS === 'ios' ? 15 : 70;
    if (y > top) {
      if (!shadowHeader) {
        setShadowHeader(true);
        console.log('hide', y);
      }
    } else if (y < 10) {
      if (shadowHeader) {
        setShadowHeader(false);
        console.log('show', y);
      }
    }
    setLastOffset(y);
  };

  return (
    <View style={styles.container}>
      <View style={shadowHeader ? styles.headerShadow : null}>
        {!shadowHeader ? (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.title} numberOfLines={1}>
              {formatPrice(
                WalletStore.totalBalance +
                  BankStore.totalBalance +
                  FiatStore.totalBalance +
                  CexStore.totalBalance,
                true,
              ) || 0.0}
            </Text>
          </View>
        ) : null}
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingRight: 20}}
          style={{
            paddingTop: 10,
            paddingHorizontal: 12,
            paddingBottom: shadowHeader ? 10 : 5,
          }}>
          {Portfolios.map((item, index) => bubble(item, index))}
        </ScrollView>
      </View>
      <screen.component onScroll={onScroll} />
    </View>
  );
});

export default PortfolioScreen;
