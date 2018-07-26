Vagrant.configure("2") do |config|
  config.vm.box = "scotch/box"
  config.vm.hostname = "scotchbox"
  config.vm.synced_folder ".", "/var/www", :mount_options => ["dmode=777", "fmode=666"]

  config.vm.network "private_network", type: "dhcp"

end
